import React from 'react'

const ProductEditor = () =>
    <div className="container jumbotron">
        <h1 className="display-4">Edit Product</h1>
        <label for="productName" class="col-sm-2 col-form-label">
				Product Name </label>
		<div class="col-sm-10">
			<input class="form-control" id="productName"
            placeholder="Mike's Mighty Mangos"/>
        </div>
        <br/>
        <label for="productDescription" class="col-sm-2 col-form-label">
				Product Description </label>
		<div class="col-sm-10">
			<textarea class="form-control" id="productDescription"
            placeholder="Premier mangos grown from the finest soil in the US."/>
        </div>
        <br/>
        <label for="price" type="number" class="col-sm-2 col-form-label">
				Product Price (US $) </label>
		<div class="col-sm-10">
			<input class="form-control" type="number" id="productPrice" min="0.00"
            placeholder=" 1.25" step="0.01"/>
        </div>
        <br/>
        <label for="imageurl" class="col-sm-2 col-form-label">
                Product Image URL </label>
        <div class="col-sm-10">
            <input class="form-control" type="number" id="imageurl" min="0.00"
            placeholder="imgur.com/R390EId"/>
        </div>
        <br/>
    </div>

export default ProductEditor
