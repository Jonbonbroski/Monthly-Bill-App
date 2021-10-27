 
 
 const clearFields = () =>{
    console.log("cleared the fields")
    document.getElementById("billName").value = ""
    document.getElementById("billAmount").value = ""
    document.getElementById("billDay").value = ""
    document.getElementById("billList").innerHTML = ""
 };

//modal toggle
const modalToggle = (btn) =>{
    // let billToEdit = btn.parentElement.parentElement
    // console.log(billToEdit.children)
    if(btn=== undefined){
        console.log("Closed")
    }else{
    
    console.log("EDIT MODAL TOGGLE",btn.parentElement.parentElement)
    let billToEdit = btn.parentElement.parentElement;
    document.getElementById("editName").value = billToEdit.children[1].attributes.value.value;
    document.getElementById("editModalTitle").textContent = "Edit bill: "+ billToEdit.children[1].attributes.value.value;
    document.getElementById("editAmount").value = billToEdit.children[2].attributes.value.value;
    document.getElementById("editDay").value = billToEdit.children[3].attributes.value.value;

    }
    let stuff ="YES"
    $('#editModal').modal("toggle")

}
//DELETE a bill
const deleteBill = async (btn)=> {
    let billToDelete = btn.parentElement.parentElement
    console.log("delete Test", billToDelete.children)
    console.log("info test", billToDelete.children[1].attributes.value.value);

    let deleteBillPrompt = window.confirm("Are you sure you want to remove this bill?")
    
    if(deleteBillPrompt === true){
    await fetch("http://localhost:5000/deleteBill",{

    method:"DELETE",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
        name:billToDelete.children[1].attributes.value.value,
        amount:billToDelete.children[2].attributes.value.value,
        day:billToDelete.children[3].attributes.value.value
    })
    })
    .then(response=>{
        
        console.log(response.json())})
    .catch(err=>{
        console.log(err)
    })
    
    }
    clearFields()
    await fetchBills();
}


 //GET all bills
 const fetchBills = async () =>{
    await clearFields();
    await fetch("http://localhost:5000/getBills",{
        method:"GET",
        headers:{},
    })
    .then(response=>{return response.json()})
    .then(data=>{console.log(data)
                let billList = document.getElementById("billList")
                let count = 1
                let total = 0;
                data.map((bill)=>{
                    let billInfo = Object.values(bill)
                    let tr  = document.createElement("tr")
                    let th = document.createElement("th")
                    let div = document.createElement("div")
                    let editBtn = document.createElement("input")
                    editBtn.type = "button"
                    editBtn.classList += "btn btn-warning"
                    let deleteBtn = document.createElement("input")
                    editBtn.value = "Edit"
                    editBtn.setAttribute("aria-hidden","true")
                    const assignEditClick = async () => {
                        await editBtn.setAttribute("onclick","modalToggle(this)")
                    }
                    assignEditClick();
                    // data-toggle="modal" data-target="#exampleModalCenter"
                    editBtn.setAttribute("data-toggle","modal");
                    editBtn.setAttribute("data-target","#editModal")
                    // div.append(editBtn)
                    deleteBtn.type = "button"
                    deleteBtn.classList += "btn btn-danger"
                    deleteBtn.value = "Delete"
                    const assignDeleteClick = async () => {
                        await deleteBtn.setAttribute("onclick","deleteBill(this)")
                    }
                    assignDeleteClick();
                    // deleteBtn.setAttribute("value","")
                    deleteBtn.setAttribute("aria-hidden","true")
                    // editBtn.append(div)
                    // editBtn.setAttribute("onclick", editModu)
                    th.setAttribute("scope","row");
                    th.textContent = count
                    // console.log(billInfo)
                    tr.append(th)
                    total+= Number(billInfo[2].toExponential())
                    for(let i=1;i < (billInfo.length-1); i++){
                        let td = document.createElement("td");
                        if(i==2){
                            td.textContent = "$"+billInfo[i].toFixed(2);
                            
                        }else{
                            td.textContent = billInfo[i];
                        }

                        td.setAttribute("value",billInfo[i])
                        tr.append(td)
                        
                    };
                    let btntr = document.createElement("td")
                    btntr.append(editBtn)
                    tr.append(btntr)
                    let deleteTr = document.createElement("td")
                    deleteTr.append(deleteBtn)
                    tr.append(deleteTr)
                    billList.append(tr)
                    count++
                 })
                 document.getElementById("total").textContent = ""
                 document.getElementById("total").textContent = "$"+ total.toFixed(2)
                })
    .catch(err=>{
        console.log(err)
    })
 };

 //ADD a bill
 const addBill = async () => {

    let billName = document.getElementById("billName").value
    let amount = document.getElementById("billAmount").value;
    let day = document.getElementById("billDay").value


    await fetch("http://localhost:5000/addBill",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            billName,
            amount,
            day
        })
        
    })
    .then(response=>{console.log(response)
                     clearFields()
                    })
    .then(data=>{
        console.log(data)})

    await fetchBills();
 };

const editBill = async ()=>{
  

    await fetch("http://localhost:5000/editBill",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:document.getElementById("editName").value,
            amount:document.getElementById("editAmount").value,
            day:document.getElementById("editDay").value
        })
        })
        .then(response=>{
            
            console.log(response.json())})
        .catch(err=>{
            console.log(err)
        })
        
        $('#editModal').modal("toggle")
        await clearFields()
        await fetchBills();
    }





 window.addEventListener("load",async ()=>{
    console.log("working?")
    await clearFields();
    await fetchBills();
 })