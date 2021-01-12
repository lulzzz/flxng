import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommonModule as FlxngCommonModule } from '@flxng/common';
import { MentionsModule as FlxngMentionsModule } from '@flxng/mentions';
import { LoaderModule as FlxngLoaderModule } from '@flxng/loader';
import { CodeShowModule as FlxngCodeShowModule } from '@flxng/code-show';

import { SharedModule } from '../../shared/shared.module';

import { OverviewComponent } from './overview.component';
import { OverviewAComponent } from './overview-a/overview-a.component';
import { OverviewBComponent } from './overview-b/overview-b.component';
import { OverviewCComponent } from './overview-c/overview-c.component';

@NgModule({
  declarations: [OverviewComponent, OverviewAComponent, OverviewBComponent, OverviewCComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlxngCommonModule,
    FlxngMentionsModule,
    FlxngLoaderModule,
    FlxngCodeShowModule,
    SharedModule,
  ],
})
export class OverviewModule {}
