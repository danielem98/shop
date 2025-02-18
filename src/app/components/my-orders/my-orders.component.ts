import { Component } from '@angular/core';
import { ListOrdersComponent } from "../list-orders/list-orders.component";
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [ListOrdersComponent, CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent {
  orders$: any;
  constructor(private orderService: OrderService) {
    this.orders$ = orderService.getOrdersByCurrentUser()
  }

}
