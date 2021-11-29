import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs';


const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'timeline',
        pathMatch: 'full',
      },
      {
        path: 'timeline',
        loadChildren: () => import('../timeline/timeline.module').then(m => m.TimelinePageModule),
      },
      {
        path: 'rooms',
        loadChildren: () => import('../live-room/live-room.module').then(m => m.LiveRoomPageModule),
      },
      {
        path: 'messages',
        loadChildren: () => import('../messages/messages.module').then(m => m.MessagesPageModule),
      },
      {
        path: 'groups',
        loadChildren: () => import('../groups/groups.module').then(m => m.GroupsPageModule),
      },
      {
        path: 'friends',
        loadChildren: () => import('../friends/friends.module').then(m => m.FriendsPageModule)
      },
      {
        path: 'profiles',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      }

      //,
      //{
      //  path: 'reported-post',
      //  loadChildren: () => import('../reported-post/reported-post.module').then(m => m.ReportedPostPageModule),
      //},
      //{
      //  path: 'add-post',
      //  loadChildren: () => import('../add-post/add-post.module').then(m => m.AddPostPageModule),
      //},
      //{
      //  path: 'message',
      //  loadChildren: () => import('../message/message.module').then(m => m.MessagePageModule),
      //},
      //{
      //  path: 'new-message',
      //  loadChildren: () => import('../new-message/new-message.module').then(m => m.NewMessagePageModule),
      //},
      //{
      //  path: 'group',
      //  loadChildren: () => import('../group/group.module').then(m => m.GroupPageModule),
      //},
      //{
      //  path: 'new-group',
      //  loadChildren: () => import('../new-group/new-group.module').then(m => m.NewGroupPageModule),
      //},
      //{
      //  path: 'group-info',
      //  loadChildren: () => import('../group-info/group-info.module').then(m => m.GroupInfoPageModule),
      //},
      //{
      //  path: 'addmember',
      //  loadChildren: () => import('../add-members/add-members.module').then(m => m.AddMembersPageModule),
      //},
      
      //{
      //  path: 'users',
      //  loadChildren: () => import('../users/users.module').then(m => m.UsersPageModule)
      //},
      //{
      //  path: 'searchpeople',
      //  loadChildren: () => import('../search-people/search-people.module').then(m => m.SearchPeoplePageModule)
      //},
      //{
      //  path: 'frendrequests',
      //  loadChildren: () => import('../Requests/Requests.module').then(m => m.RequestsPageModule)
      //},
      //{
      //  path: 'userinfo',
      //  loadChildren: () => import('../user-info/user-info.module').then(m => m.UserInfoPageModule)
      //},
      //{
      //  path: 'message',
      //  loadChildren: () => import('../message/message.module').then(m => m.MessagePageModule)
      //}
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
