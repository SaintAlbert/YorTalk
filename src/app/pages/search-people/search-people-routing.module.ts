import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPeoplePage } from './search-people';

const routes: Routes = [
  {
    path: '',
    component: SearchPeoplePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPeoplePageRoutingModule {}
