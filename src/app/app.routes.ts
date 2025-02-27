import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { ProductsComponent } from './components/products/products.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    //lazyLoading
    {path: 'products', loadComponent: ()=> import('./components/products/products.component')
        .then(c => c.ProductsComponent)},
    {path: 'login', loadComponent: () => import('./components/login/login.component')
        .then(c => c.LoginComponent)},
    {path: 'shopping-cart', loadComponent: () => import('./components/shopping-cart/shopping-cart.component')
        .then(c => c.ShoppingCartComponent)},

    {path: 'check-out', loadComponent: () => import('./components/check-out/check-out.component')
        .then(c => c.CheckOutComponent), canActivate:[authGuard]},   
    {path: 'my-orders', loadComponent: () => import('./components/my-orders/my-orders.component')
        .then(c => c.MyOrdersComponent), canActivate:[authGuard]},
    {path: 'order-success/:id', loadComponent: () => import('./components/order-success/order-success.component')
        .then(c => c.OrderSuccessComponent), canActivate:[authGuard]},

    {path: 'admin/products', loadComponent: () => import('./adminComponents/admin-products/admin-products.component')
        .then(c => c.AdminProductsComponent), canActivate:[authGuard, AdminAuthGuardService], children:[
            {path: 'new', loadComponent: () => import('./adminComponents/product-form/product-form.component')
                .then(c => c.ProductFormComponent)},
            {path: ':id', loadComponent: () => import('./adminComponents/product-form/product-form.component')
                .then(c => c.ProductFormComponent)},
        ]
    },
     
    {path: 'admin/orders', loadComponent: () => import('./adminComponents/admin-orders/admin-orders.component')
        .then(c => c.AdminOrdersComponent),canActivate:[authGuard, AdminAuthGuardService]},
];
