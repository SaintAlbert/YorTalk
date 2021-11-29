import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AddPostPage} from './add-post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddPostPageRoutingModule } from './add-post-routing.module';
import { PipesModule } from '../../pipes.module';

@NgModule({
  declarations: [
    AddPostPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AddPostPageRoutingModule
  ],
  //exports: [
  //  AddPostPage
  //]
})
export class AddPostPageModule {}
