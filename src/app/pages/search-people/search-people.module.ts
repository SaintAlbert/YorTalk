import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SearchPeoplePage } from './search-people';

//import { FriendsPageRoutingModule } from './friends-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
   // FriendsPageRoutingModule
  ],
  declarations: [SearchPeoplePage]
})
export class SearchPeoplePageModule {}
