import { Component } from '@angular/core';

/* Angular firebase */
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';


import { Product } from './models/Product';
import { Category } from './models/Category';
import { Observable } from 'rxjs';

import { of } from 'rxjs';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'Prueba David Sepulveda';

  newProduct: Product = new Product();

  selectedProduct: Product = { ...this.newProduct };

  editedProduct: Product = { ...this.selectedProduct };

  categories: Category[];

  oldCategory: string = '';

  products: Product[] = [];

  autosaveTimeout = 0;

  private fire: AngularFirestore;

  private storage: AngularFireStorage;

  
  constructor(firestore: AngularFirestore, st: AngularFireStorage) {
    this.fire = firestore;
    this.storage = st;
    
    this.categories = [];
    firestore.collection('products').stateChanges().subscribe(i=>{
      i.forEach(category =>{

        if(category.type == 'added')
        {
            var data = (category.payload.doc.data() as Category);
            this.categories.push({ id: category.payload.doc.id, title: data.title, description: '', img: '' });

            firestore.collection('products')
            .doc(category.payload.doc.id)
            .collection('items')
            .stateChanges()
            .subscribe(items=>{
              items.forEach(product=>{
                var data = (product.payload.doc.data() as Product);

                const index = this.products.findIndex(el => el.id == product.payload.doc.id);

                switch(product.type)
                {
                  case 'added':
                    this.products.push({ id: product.payload.doc.id, img: data.img, title: data.title, description: data.description, category: category.payload.doc.id });
                    break;
                  case 'modified':
                    break;
                  case 'removed':
                    
                    if( index >= 0 )
                    {
                      this.products.splice(index, 1);
                      if( product.payload.doc.id == this.selectedProduct.id )
                        this.SetSelectedProduct(this.newProduct);
                    }
                    break;
                }
              });
            });
        }
        
      });
    });
    
  }

  SetSelectedProduct(product: Product)
  {
    if (this.isUploading)
      return;
      this.selectedProduct = product.id == this.newProduct.id ? { ...this.newProduct } : { ...product };
      this.oldCategory = this.selectedProduct.category;
  }
  
  OnTitleChange(val: Event)
  {
    this.selectedProduct.title = (val.target as HTMLInputElement).value;
    this.AutoSave();
  }
  
  OnDescriptionChange(val: Event)
  {
    this.selectedProduct.description = (val.target as HTMLInputElement).value;
    this.AutoSave();
  }
  
  OnCategoryChange(val: Event)
  {
    this.oldCategory = this.selectedProduct.category;
    this.selectedProduct.category = (val.target as HTMLInputElement).value;
    this.AutoSave();
  }
  
  isUploading: Boolean = false;
  uploadPercentage: number = 0;
  
  OnFileChanged(val: Event)
  {
    var input = (val.target as HTMLInputElement);
    if(input.files?.length)
    {
      this.isUploading = true;
      var file = input.files[0];
      this.DisableInputs();
      const filePath = `uploads/${file.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      uploadTask
      .percentageChanges()
      .subscribe(t=>{
        this.uploadPercentage = Math.round(t ?? 0);
      });

      uploadTask.then(r=>{
        r.task.snapshot.ref.getDownloadURL().then(url=>{
          this.selectedProduct.img = url;
          this.isUploading = false;
          this.DisableInputs(false);
          this.AutoSave();
        });
      });
    }
  }

  DisableInputs(disable: Boolean = true)
  {
    if(disable)
    {

      document.getElementById('new-product-title')?.setAttribute('disabled', 'true');
      document.getElementById('new-product-category')?.setAttribute('disabled', 'true');
      document.getElementById('new-product-description')?.setAttribute('disabled', 'true');
      document.getElementById('new-product-delete')?.setAttribute('disabled', 'true');

    }else{

      document.getElementById('new-product-title')?.removeAttribute('disabled');
      document.getElementById('new-product-category')?.removeAttribute('disabled');
      document.getElementById('new-product-description')?.removeAttribute('disabled');
      document.getElementById('new-product-delete')?.removeAttribute('disabled');
      
    }
  }

  AutoSave()
  {
    if(this.autosaveTimeout)
      window.clearTimeout(this.autosaveTimeout);

    this.autosaveTimeout = window.setTimeout(()=>{

      this.Save();
      
    }, 1000);
  }

  isSaving: Boolean = false;
  Save()
  {
    //Solo guardar cambios si se ha seleccionado una categoría
    if(this.selectedProduct.category == '' || this.isSaving)
      return;

    this.isSaving = true;

    var index = -1;

    console.log(this.oldCategory, this.selectedProduct.category)

    if(this.oldCategory != '' && this.oldCategory != this.selectedProduct.category)
    {
      this.Delete({ ...this.selectedProduct, id: this.selectedProduct.id, category: this.oldCategory });
    }else{
      index = this.products.findIndex(el => el.id == this.selectedProduct.id);
    }

    if( index >= 0 )
    {
      //Actualiza
      this.fire
      .collection('products')
      .doc(this.selectedProduct.category)
      .collection('items')
      .doc(this.selectedProduct.id)
      .update({ title: this.selectedProduct.title, description: this.selectedProduct.description, img: this.selectedProduct.img })
      .then(p=>{
        
      })
      .finally(()=>{
        this.products[index] = { ...this.selectedProduct };
        this.isSaving = false;
      });
    }
    else
    {
      //Crea
      this.fire
        .collection('products')
        .doc(this.selectedProduct.category)
        .collection('items')
        .add({ title: this.selectedProduct.title, description: this.selectedProduct.description, img: this.selectedProduct.img })
        .then(p=>{
          this.selectedProduct.id = p.id;
        })
        .finally(()=>{
          this.isSaving = false;
        });
    }
  }

  Delete(product: Product)
  {
    this.fire
      .collection('products')
      .doc(product.category)
      .collection('items')
      .doc(product.id)
      .delete();
  }
}
