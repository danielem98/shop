import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Component } from '@angular/core';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    //lazyLoading
    {path: 'products', loadComponent: ()=> import('./components/products/products.component').then(c => c.ProductsComponent)},
    {path: 'check-out', loadComponent: () => import('./components/check-out/check-out.component').then(c => c.CheckOutComponent)},
    {path: 'shopping-cart', loadComponent: () => import('./components/shopping-cart/shopping-cart.component').then(c => c.ShoppingCartComponent)},
    {path: 'my-orders', loadComponent: () => import('./components/my-orders/my-orders.component').then(c => c.MyOrdersComponent)},
    {path: 'order-success', loadComponent: () => import('./components/order-success/order-success.component').then(c => c.OrderSuccessComponent)},
    {path: 'login', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)},
    {path: 'admin/products', loadComponent: () => import('./adminComponents/admin-products/admin-products.component').then(c => c.AdminProductsComponent)},
    {path: 'admin/order', loadComponent: () => import('./adminComponents/admin-orders/admin-orders.component').then(c => c.AdminOrdersComponent)},
];
