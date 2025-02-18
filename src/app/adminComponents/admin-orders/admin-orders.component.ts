import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { ListOrdersComponent } from "../../components/list-orders/list-orders.component";

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, ListOrdersComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit{
  orders$: any;
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.getOrders()
  }

}
