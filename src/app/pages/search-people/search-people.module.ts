import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SearchPeoplePage } from './search-people';
import { SearchPeoplePageRoutingModule } from './search-people-routing.module';
import { PipesModule } from '../../pipes.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SearchPeoplePageRoutingModule
  ],
  declarations: [SearchPeoplePage],
  //exports: [SearchPeoplePage],
})
export class SearchPeoplePageModule {}
