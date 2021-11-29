import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '*', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  }
  ,
  {
    path: 'reported-post',
    loadChildren: () => import('./pages/reported-post/reported-post.module').then(m => m.ReportedPostPageModule),
  },
  {
    path: 'add-post',
    loadChildren: () => import('./pages/add-post/add-post.module').then(m => m.AddPostPageModule),
  },
  {
    path: 'message',
    loadChildren: () => import('./pages/message/message.module').then(m => m.MessagePageModule),
  },
  {
    path: 'new-message',
    loadChildren: () => import('./pages/new-message/new-message.module').then(m => m.NewMessagePageModule),
  },
  {
    path: 'group',
    loadChildren: () => import('./pages/group/group.module').then(m => m.GroupPageModule),
  },
  {
    path: 'new-group',
    loadChildren: () => import('./pages/new-group/new-group.module').then(m => m.NewGroupPageModule),
  },
  {
    path: 'group-info',
    loadChildren: () => import('./pages/group-info/group-info.module').then(m => m.GroupInfoPageModule),
  },
  {
    path: 'addmember',
    loadChildren: () => import('./pages/add-members/add-members.module').then(m => m.AddMembersPageModule),
  },

  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule)
  },
  {
    path: 'searchpeople',
    loadChildren: () => import('./pages/search-people/search-people.module').then(m => m.SearchPeoplePageModule)
  },
  {
    path: 'frendrequests',
    loadChildren: () => import('./pages/Requests/requestsfriend.module').then(m => m.RequestsFriendPageModule)
  },
  {
    path: 'userinfo',
    loadChildren: () => import('./pages/user-info/user-info.module').then(m => m.UserInfoPageModule)
  },
  {
    path: 'message',
    loadChildren: () => import('./pages/message/message.module').then(m => m.MessagePageModule)
  },
  {
    path: 'newpotlive',
    loadChildren: () => import('./pages/new-live-room/new-live-room.module').then(m => m.NewLiveRoomPageeModule)
  }
  
];


//export class AppCustomPreloader implements PreloadingStrategy {
//  preload(route: Route, load: Function): Observable<any> {
//    return route.data && route.data.preload ? load() : of(null);
//  }
//}

@NgModule({
  imports: [
    //RouterModule.forRoot(routes
    //  //{ enableTracing: true }
    //  //{ enableTracing: true , preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' }
    //)
    //RouterModule.forRoot(routes,
    //  //{ preloadingStrategy: AppCustomPreloader }
    //)
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  //providers: [AppCustomPreloader]
})
export class AppRoutingModule { }
