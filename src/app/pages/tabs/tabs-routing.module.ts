import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs';

import { HomePage } from '../home/home';
import { MessagesPage } from '../messages/messages';
import { GroupsPage } from '../groups/groups';
import { FriendsPage } from '../friends/friends';
import { TimelinePage } from '../timeline/timeline';

//const routes: Routes = [
//  {
//    path: 'tabs',
//    component: TabsPage,
//    children: [
//      {
//        path: 'schedule',
//        children: [
//          {
//            path: '',
//            loadChildren: '../schedule/schedule.module#ScheduleModule'
//          }
//        ]
//      },
//      {
//        path: '',
//        redirectTo: '/app/tabs/schedule',
//        pathMatch: 'full'
//      }
//    ]
//  }
//];

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/timeline',
        pathMatch: 'full',
      },
      {
        path: 'timeline',
        loadChildren: '../timeline/timeline.module#TimelinePageModule'
        //loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
       // component: TimelinePage
      },
      {
        path: 'messages',
        loadChildren: '../messages/messages.module#MessagesPageModule'
        //component: MessagesPage
      },
      {
        path: 'groups',
        loadChildren: '../groups/groups.module#GroupsPageRoutingModule'
       // component: GroupsPage
      },
      {
        path: 'friends',
        loadChildren: '../friends/friends.module#FriendsPageRoutingModule'
        //component: FriendsPage
      },
      {
        path: 'profile',
        loadChildren: '../home/home.module#HomePageModule'
        //component: HomePage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/timeline',
    pathMatch: 'full'
  }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
