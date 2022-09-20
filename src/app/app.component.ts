import { Component } from '@angular/core';
import {HttpService} from "../app/service/http.service"
interface User {
  id: string;
  task_name: string;
  task_completed: boolean;
  task_created_date: Date;
  checked : boolean
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  columns :any;
  listOfData : User[];
  listOfDataUnfiltered : User[];

  constructor(private httpservice: HttpService){ 
    this.listOfData = []
    this.listOfDataUnfiltered = []
    this.httpservice.getColumns().subscribe(data => {
      this.columns = data
    })
    this.httpservice.getData().subscribe(data => {
      this.listOfData = data
      this.listOfDataUnfiltered = data

      this.listOfData.forEach(el => {
        el.checked = false
      })

      console.log(this.listOfData)
    })
  }

  ngOnInit() {
 }
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.checkAll(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 !== 0)
        );
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 === 0)
        );
      }
    }
  ];
  allChecked = false
  title = 'table';
  position = 'both';
  descend = "descend";
  searchValue = '';
  visible = false;
  visibleCheck = false;
  sort = ""
  saveColumn(event:any){
    var target = event.target || event.srcElement || event.currentTarget;
    var col = target.parentNode.parentNode.parentNode.attributes[1].nodeValue

    this.sort = col
    console.log(this.sort)
  }
  saveColumnSearch(event:any){
    var target = event.target || event.srcElement || event.currentTarget;
    var col = target.parentNode.parentNode.parentNode.parentNode.parentNode.attributes[1].nodeValue
    console.log(col)
    this.sort = col
  }
  resetAll(): void{
    window.location.reload()
  }
  reset(): void {
    this.searchValue = '';
    this.listOfData = this.listOfDataUnfiltered
  }

  search(): void {
    this.visible = false;
    console.log(this.searchValue)
    this.httpservice.search(this.sort, this.searchValue).subscribe((data:any) => {
      console.log(data)
      this.listOfData = data 
    })
      console.log(this.listOfData)
      }

  sortFn = (a : any, b: any) => {
    if(this.sort == "task_name")
      return a.name.localeCompare(b.task_name)
    else
      if(this.sort == "task_created_date")
        return a.date.localeCompare(b.task_created_date)
      else
        if(this.sort == "id")
          return a.id - b.id
        else
          return a.task_completed - b.task_completed
  };


  listOfFilter = [
    {text: 'true', value: true},
    {text: 'false', value: false}
  ]

  filterFn = ((list: any) => {
    console.log(list)
    if (list.length > 1 || list.length == 0){
      this.listOfData = this.listOfDataUnfiltered
    }
    else{
      this.httpservice.getFiltered(list[0]).subscribe((data:any) => {
        this.listOfData = data
      })
    }
  })
 
  checkAll(value: boolean): void {
    this.listOfData.forEach(data => {
      data.checked = value;
    });
  }

  setOfCheckedId = new Set<string>();
  indeterminate = false;

  updateCheckedSet(id: string, checked: boolean): void {
    var el = this.listOfData.filter(el => el.id === id)
    el[0].checked = checked
    }
}
