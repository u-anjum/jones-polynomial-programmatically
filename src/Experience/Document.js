import Experience from './Experience.js'
import $ from 'jquery'

export default class Document
{
    constructor()
    {
        this.base = process.env.NODE_ENV == 'development'? "http://knot-editor.com/api.php?" : "http://146.190.147.177/api.php?";

        this.experience = new Experience()
        this.curve = this.experience.world.curve
        this.ui = this.experience.ui
        this.documentName = "Untitled-" + Math.round(Math.random() * 10000)
        this.statistics = this.experience.world.statistics

        this.txtName = document.querySelector('.txtSave')
        this.btn = document.querySelector('.btnSave')
        this.list = document.querySelector('.curves-list ul')

        this.btn.addEventListener('click', () => this.saveDocument())
        this.txtName.addEventListener('keyup', e => this.updateDocumentName(e))

        this.txtName.value = this.documentName

        this.processing = false
        this.loadDocumentList()

        $(document, '.curves-list ul a', 'click')
        $(document).on('mousedown', '.curves-list ul a', e => e.stopPropagation())
        $(document).on('click', '.curves-list ul a', e => this.importKnot(e))

        $(document).on('mousedown', '.curves-list ul img', e => e.stopPropagation())
        $(document).on('click', '.curves-list ul img', e => this.deleteKnot(e))
    }

    updateDocumentName(e) {
        this.documentName = e.target.value
    }

    saveDocument() {
        if(this.processing)
            return

        this.processing = true;

        let data = "action=add"
        data += "&name=" + this.documentName
        data += "&json=" + this.curve.export()
        
        fetch(this.base,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: "POST",
            body: data
        })
        .then((res) => { 
            this.processing = false
            this.loadDocumentList()
            alert(this.documentName + " has been saved successfully.")
        })
    }

    loadDocumentList() {
        this.list.innerHTML = "<li>Loading...</li>"
        
        let data = "action=list"

        fetch(this.base,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: "POST",
            body: data
        })
        .then((res) => res.json())
        .then(data => {
            this.list.innerHTML = "";

            const keys = Object.keys(data);
            for(let i=0; i<keys.length; i++) {
                const item = data[keys[i]];
                this.list.innerHTML += `<li><img src='./delete.png' data-id='${item.id}' /> <a href='' data-id='${item.id}'>${item.name}</a></li>`
            }
        })
    }

    importKnot(e) {
        e.stopPropagation()
        e.preventDefault()

        let data = "action=get"
        data += "&id=" + e.target.dataset.id

        fetch(this.base,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: "POST",
            body: data
        })
        .then((res) => res.json())
        .then(data => {
            this.txtName.value = data.name
            this.documentName = data.name
            this.ui.setMode('editing')
            this.curve.import(data.json)

            this.statistics.render()
        })
    }

    deleteKnot(e) {
        e.stopPropagation()
        e.preventDefault()

        if(this.processing)
            return

        this.processing = true;

        let data = "action=delete"
        data += "&id=" + e.target.dataset.id

        fetch(this.base,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: "POST",
            body: data
        })
        .then(() => {
            this.processing = false
            this.loadDocumentList()
        })
    }
}