import { NgModule } from "@angular/core";
import { ConversationPipe } from "./pipes/conversation";
import { DateFormatPipe } from "./pipes/date";
import { FriendPipe } from "./pipes/friend";
import { GroupPipe } from "./pipes/group";
import { SearchPipe } from "./pipes/search";

//import custom pipes here
@NgModule({
  declarations: [
    FriendPipe, SearchPipe, ConversationPipe, DateFormatPipe, GroupPipe
  ],
  imports: [],
  exports: [
    FriendPipe, SearchPipe, ConversationPipe, DateFormatPipe, GroupPipe
  ]
})
export class PipesModule { }
