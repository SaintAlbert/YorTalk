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
        loadChildren: () => import('../timeline/timeline.module').then(m => m.TimelinePageModule),
        children: [
          {
            path: 'timeline/reported-post',
            loadChildren: () => import('../reported-post/reported-post.module').then(m => m.ReportedPostPageModule),
          },
          {
            path: 'timeline/add-post',
            loadChildren: () => import('../add-post/add-post.module').then(m => m.AddPostPageModule),
          }
        ]
      },
      {
        path: 'messages',
        loadChildren: () => import('../messages/messages.module').then(m => m.MessagesPageModule),
        children: [
          {
            path: 'messages/message',
            loadChildren: () => import('../message/message.module').then(m => m.MessagePageModule),
          },
          {
            path: 'messages/new-message',
            loadChildren: () => import('../new-message/new-message.module').then(m => m.NewMessagePageModule),
          }
        ]
      },
      {
        path: 'users',
        loadChildren: () => import('../users/users.module').then(m => m.UsersPageModule)
      },
      {
        path: 'groups',
        loadChildren: () => import('../groups/groups.module').then(m => m.GroupsPageModule),
        children: [
          {
            path: 'groups/group',
            loadChildren: () => import('../group/group.module').then(m => m.GroupPageModule),
          },
          {
            path: 'groups/new-group',
            loadChildren: () => import('../new-group/new-group.module').then(m => m.NewGroupPageModule),
          },
          {
            path: 'groups/group-info',
            loadChildren: () => import('../group-info/group-info.module').then(m => m.GroupInfoPageModule),
          },
          {
            path: 'groups/addmember',
            loadChildren: () => import('../add-members/add-members.module').then(m => m.AddMembersPageModule),
          }
        ]
      },
      {
        path: 'friends',
        loadChildren: () => import('../friends/friends.module').then(m => m.FriendsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      }
    ]
  },

  {
    path: 'searchpeople',
    loadChildren: () => import('../search-people/search-people.module').then(m => m.SearchPeoplePageModule)
  },
  {
    path: 'frendrequests',
    loadChildren: () => import('../Requests/Requests.module').then(m => m.RequestsPageModule)
  },
  {
    path: 'userinfo',
    loadChildren: () => import('../user-info/user-info.module').then(m => m.UserInfoPageModule)
  },
  {
    path: 'message',
    loadChildren: () => import('../message/message.module').then(m => m.MessagePageModule)
  }
 
  //{
  //  path: 'searchpeople',
  //  redirectTo: '/tabs/timeline',
  //  pathMatch: 'full'
  //}
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
