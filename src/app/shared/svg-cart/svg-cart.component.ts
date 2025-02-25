import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-cart.component.html',
  styleUrl: './svg-cart.component.css'
})
export class SvgCartComponent {
@Input() type: 'normal' | 'plus' | 'minus' = 'normal'
@Input() color: 'black'| 'white' = 'black'
@Input() height: String | undefined

  get fillColor(){
    return this.color === 'black' ? '#000000' : '#ffffff'
  }

  get heigthValue(){
    return this.height ? `${this.height}px` : '24px'
  }

}
