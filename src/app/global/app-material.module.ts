import { NgModule } from '@angular/core';

import {
  MatAutocompleteModule,
  MatInputModule,
  MatDividerModule,
  MatListModule,
  MatSidenavModule,
  MatCardModule,
  MatGridListModule,
  MatToolbarModule,
  MatTabsModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatMenuModule, MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule,
  MatRadioModule,
  MatExpansionModule,
  MatBadgeModule,
  MatSlideToggleModule
} from '@angular/material';

import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { TreeTableModule } from 'primeng/treetable';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSlideToggleModule,


    ToastModule,
    TooltipModule,
    ConfirmDialogModule,
    TreeTableModule
  ]
})
export class AppMaterialModule { }
