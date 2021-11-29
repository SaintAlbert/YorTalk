import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home';
import { PipesModule } from '../../pipes.module';
import { HomePageRoutingModule } from './home-routing.module';

//import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  //exports: [HomePage],
})
export class HomePageModule {}
