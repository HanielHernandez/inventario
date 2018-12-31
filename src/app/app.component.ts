import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule , FormGroup} from '@angular/forms';
import { Item}from 'src/app/models/item.model';
import { ExcelService } from './services/excel.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ExcelService]
})
export class AppComponent implements OnInit{
  title = 'inventario';
  public inventory_title:String;
  public message:String;
  numer:number;
  public items:Array<Item>;
  constructor( private excelService:ExcelService){
this.message=""


  }
ngOnInit(){

  this.items=JSON.parse(localStorage.getItem('items'));
  this.inventory_title=JSON.parse(localStorage.getItem('inventoryTitle'));
  
  if(this.inventory_title==null){
    this.inventory_title="Nuevo documento"
  }

}
public newInventory(){
  localStorage.clear();
  this.inventory_title="";
  this.items= new Array<Item>();
  this.inventory_title="Nuevo documento";

}
public saveTitle(){
  localStorage.setItem("inventoryTitle",JSON.stringify(this.inventory_title))
  localStorage.setItem("items",JSON.stringify(this.items))
  this.message="Datos Guardados";
  setTimeout(function() {
   this.message="";
}, 5000);
}
public changeListener(files: FileList){
    console.log(files);
    if(files && files.length > 0) {
       let file : File = files.item(0); 
         console.log(file.name);
         console.log(file.size);
         console.log(file.type);
         let reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
            let csv: string = reader.result as string;
            var json = this.processData(csv);
           this.items=json;
           localStorage.setItem("items",JSON.stringify(this.items))

           console.log(this.items);
         }
      }
  }
   processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(';');
    var lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        if (data.length == headers.length) {

            var tarr = {};
            for (var j = 0; j < headers.length; j++) {
                tarr[headers[j]]=data[j];
            }
            lines.push(tarr);
        }
    }
   return lines;
}
public sumItem(descripcion:any,operation:string){
  var item:Item =this.items.find(obj => {
    return obj.descripcion === descripcion
  });
  //console.log(item.);
  if(operation=="sum" ){
    item.fisico=Number(item.fisico)+Number(this.numer);
  }else{
    if( item.fisico>Number(this.numer)){
      item.fisico=Number(item.fisico)-Number(this.numer);
    }
  }
  item.total=Number(item.fisico)*Number(item.unidad);

  this.numer=null;
 // console.log(city.deparment_id);
}
dowloaddata(){
  this.excelService.exportAsExcelFile(this.items, this.inventory_title.toString());
}


}
