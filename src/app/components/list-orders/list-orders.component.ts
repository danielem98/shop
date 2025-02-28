import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'list-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.css'
})
export class ListOrdersComponent {
  @Input() orders: any;

  constructor(public orderService: OrderService) {
    
  }


}
