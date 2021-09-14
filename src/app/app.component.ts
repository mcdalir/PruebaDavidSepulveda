import { Component } from '@angular/core';

import { Product } from './models/Product';

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

  categories = [
    {id: '1', name: 'Lavadoras'},
    {id: '2', name: 'Refrigeración'},
    {id: '3', name: 'Estufas'},
  ];

  products: Product[] = [
    {id: '1', title: 'Primer producto', category:'2', description: 'El alabastro, palabra que proviene del latín alabastrum,​ es una variedad de sulfato de calcio, del aljez o de piedra de yeso (sulfato cálcico hidratado) que se presenta bajo forma compacta, contrariamente a la selenita, que es una variedad fibrosa.', img: 'https://via.placeholder.com/1024C/FFFFFF/181818/?text=1'},
    {id: '2', title: 'Segundo producto', category:'3', description: 'Ninguna', img: 'https://via.placeholder.com/512C/O?text=2'},
    {id: '3', title: 'Tercer producto', category:'1', description: 'Ninguna', img: 'https://via.placeholder.com/512C/O?text=3'},
  ];

  autosaveTimeout = 0;


  SetSelectedProduct(product: Product)
  {
    this.selectedProduct = product.id == this.newProduct.id ? { ...this.newProduct } : { ...product };
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
    this.selectedProduct.category = (val.target as HTMLInputElement).value;
    console.log(this.selectedProduct.category)
    this.AutoSave();
  }

  OnFileChanged(val: Event)
  {
    var input = (val.target as HTMLInputElement);

    if(input.files?.length)
    {
      var file = input.files[0];
      console.log(file.name)
      console.log(file.type)
      file.arrayBuffer()
      .then( buffer =>{
        var imgBuffer = new Uint8Array(buffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '');
        this.selectedProduct.img = "data:"+ file.type +";base64," + window.btoa(imgBuffer);
        this.AutoSave();
      });
    }
  }

  AutoSave()
  {
    if(this.autosaveTimeout)
      window.clearTimeout(this.autosaveTimeout);

    this.autosaveTimeout = window.setTimeout(()=>{

      this.Save();
      
    }, 250);
  }

  Save()
  {
    const index = this.products.findIndex(el => el.id == this.selectedProduct.id);
    if( index >= 0 )
    {
      this.products[index] = { ...this.selectedProduct };
    }
    else
    {
      this.selectedProduct = { ...this.selectedProduct, id: (this.products.length + 1).toString() };
      this.products.push(this.selectedProduct);
    }
  }

  Delete(product: Product)
  {
    console.log('Eliminar', product)
  }
}
