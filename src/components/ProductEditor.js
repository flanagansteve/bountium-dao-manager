import React from 'react'
import ProductService from '../services/ProductService'

export default class ProductEditor extends React.Component {
    constructor(props) {
        super(props)
        this.service = ProductService.getInstance()
        this.id = props.id
        this.state = {
        versions: [],
        alert: ""
    }
    this.addVersion = this.addVersion.bind(this)
    this.renderExistingVersion = this.renderExistingVersion.bind(this)
    this.deleteVersion = this.deleteVersion.bind(this)
    this.updateProduct = this.updateProduct.bind(this)
}

    addVersion() {
        let versions = this.state.versions;
        versions.push(document.getElementById("version-input").value);
        this.setState({versions: versions})
        document.getElementById("versions-input").value = "";
    }

    renderExistingVersion(tag, i) {
        return <div key={i} className="input-group">
        <input className="form-control col-6" value={tag} disabled={true}/>
        <button className="btn btn-info" id={i} onClick={this.deleteVersion}>Delete</button>
        </div>
    }

    deleteVersion(e) {
        document.getElementById("version-input").value = this.state.versions[e.target.id];
        let versions = this.state.versions;
        versions.splice(e.target.id, 1);
        this.setState({versions:versions});
    }

    checkFields(product) {
        if (product.name === "") {
            this.setState({
                alert: <div className="alert alert-danger">Product must have a name</div>
            })
            return false
        }
        else if (product.price === "") {
            this.setState({
                alert: <div className="alert alert-danger">Product must have a price</div>
            })
            return false
        }
        this.setState({alert: ""})
        return true
    }

    updateProduct() {
        let name = document.getElementById("productName").value
        let description = document.getElementById("productDescription").value
        let price = document.getElementById("productPrice").value
        let url = document.getElementById("imageurl").value
        let product = {
                name: name,
                description: description,
                price: price,
                imageurl: url,
                versions: this.state.versions}
        if (this.checkFields(product)) {
            this.service.updateProduct("123", product)
            window.location.href = "/"
        }
    }

    render() {
        return(
        <div className="container">
            {this.state.alert}
            <div className="jumbotron">
                <h1 className="display-4">Edit Product</h1>
                <label htmlFor="productName" className="col-sm-4 col-form-label">
        				Product Name </label>
        		<div className="col-sm-10">
        			<input className="form-control" id="productName"
                    placeholder="Mike's Mighty Mangos"/>
                </div>
                <br/>
                <label htmlFor="productDescription" className="col-sm-4 col-form-label">
        				Product Description </label>
        		<div className="col-sm-10">
        			<textarea className="form-control" id="productDescription"
                    placeholder="Premier mangos grown from the finest soils in the US."/>
                </div>
                <br/>
                <label htmlFor="price" className="col-sm-4 col-form-label">
        				Product Price (US $) </label>
        		<div className="col-sm-10">
        			<input className="form-control" type="number" id="productPrice" min="0.00"
                    placeholder=" 1.25" step="0.01"/>
                </div>
                <br/>
                <label htmlFor="imageurl" className="col-sm-4 col-form-label">
                        Product Image URL </label>
                <div className="col-sm-10">
                    <input className="form-control" id="imageurl" min="0.00"
                    placeholder="imgur.com/R390EId"/>
                </div>
                <br/>
                <label htmlFor="version-input" className="col-sm-4 col-form-label">
                    Product Versions (Optional) </label>
                <div className="container-fluid input-group" id="versions-input">
                    {this.state.versions.map(this.renderExistingVersion)}
                    <input type="text" id="version-input" className="form-control col-6" placeholder="Mini Mango"/>
                <button onClick={this.addVersion} className="btn btn-secondary">Add Version</button>
                </div>
                <br/>
                <div className="container-fluid" id="btnxf">
                    <button className="btn-lg btn-primary"
                            onClick={() => this.updateProduct()}>Save</button>
                </div>
            </div>
        </div>
    )}}
