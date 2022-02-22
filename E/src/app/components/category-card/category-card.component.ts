import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-category-card',
  template: `
    <div class="col ratio-1x1 square">
      <div class="card category-card bg-dark text-white text-center" data-id="{{ category.id }}" tabindex="0">
        <img src="https://www.eecs.yorku.ca/course_archive/2021-22/F/4413/files/project/D/images/{{ category.id }}.jpg" class="card-img" alt="{{ category.name }}">
        <div class="card-img-overlay">
          <h3 class="card-title display-6">{{ category.name }}</h3>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class CategoryCardComponent implements OnInit {
  @Input() category = {id: 0, name: ''};

  constructor() { }

  ngOnInit(): void {
  }

}
