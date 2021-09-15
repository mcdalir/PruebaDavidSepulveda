import { Component, OnInit } from '@angular/core';

/* Angular firebase */
import { AngularFirestore } from '@angular/fire/compat/firestore';


import { Product } from '../models/Product';
import { Category } from '../models/Category';

// import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-front-end',
  templateUrl: './front-end.component.html',
  styleUrls: ['./front-end.component.css']
})
export class FrontEndComponent implements OnInit {
  categories: Category[] = [];

  constructor(firestore: AngularFirestore) {
    // this.categories = [];

    firestore.collection('products')
    .stateChanges()
    .subscribe(p=>{
      p.forEach(category=>{
        if(category.type == 'added')
        {
            var data = (category.payload.doc.data() as Category);
            this.categories.push({ id: category.payload.doc.id, title: data.title, description: '', img: '' });

            // firestore.collection('products')
            // .doc(category.payload.doc.id)
            // .collection('items')
            // .stateChanges()
            // .subscribe(items=>{
            //   items.forEach(product=>{
            //     var data = (product.payload.doc.data() as Product);

            //     const index = this.products.findIndex(el => el.id == product.payload.doc.id);

            //     switch(product.type)
            //     {
            //       case 'added':
            //         this.products.push({ id: product.payload.doc.id, img: data.img, title: data.title, description: data.description, category: category.payload.doc.id });
            //         break;
            //       case 'modified':
            //         break;
            //       case 'removed':
                    
            //         if( index >= 0 )
            //         {
            //           this.products.splice(index, 1);
            //           if( product.payload.doc.id == this.selectedProduct.id )
            //             this.SetSelectedProduct(this.newProduct);
            //         }
            //         break;
            //     }
            //   });
            // });
            
        }
      });
    });
    
  }

  ngOnInit(): void {

  }
}

