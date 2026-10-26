# Variant management

> **Source:** [https://open.shopee.com/developer-guide/219](https://open.shopee.com/developer-guide/219)
> **Type:** Developer Guide / Overview
> **document_id:** `219`
> **Section:** API Guidelines and Flows

## Content

Shopee supports defining variant structures with up to two levels of specifications. The total number of variants cannot exceed 50.
For example, if an item has a color specification, the color is red, or blue, we call this 1-tier variation.
For example, if the product has color and size specifications, color is red, blue, size is L, XL, we call this 2-tier variation.
 
To add variants when creating an item, please refer to the article on Creating product (https://open.shopee.com/developer-guide/211).
To manage variants after creating an item, please refer to this article. 
To manage the stock and price of a variation, please refer to the Stock and Price Management (https://open.shopee.com/developer-guide/223) article.
1. Adding variants with same tier structureScenario 1: The product has already defined color specifications with red and blue colors, now you need to add black for the middle position of option.
Variant situation:
tier_indexoptionmodel_idtier_index[0]red10000tier_index[1]  (To be added）black (To be added）-tier_index[2]blue20000API: v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1) + v2.product.add_model (https://open.shopee.com/documents/v2/v2.product.add_model?module=89&type=1)
 
1.1 Call the v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1) API to add a black option first
Request example:
{

    "item_id": 800250275,

    "tier_variation": [

        {

            "name": "Color",

            "option_list": [

                {

                    "option": "red"

                },

                {

                    "option": "black"

                },

               {

                    "option": "blue"

                }

            ]

        }

    ],

    "model_list": [

        {

            "tier_index": [0],

            "model_id": 10000

        },

        {

            "tier_index": [2],

            "model_id": 20000

        }

    ]

} 
 
1.2 Call the v2.product.add_model (https://open.shopee.com/documents/v2/v2.product.add_model?module=89&type=1) API to add price, stock, SKU information for the black variant:
Request example:
{

"item_id": 800250275,

"model_list": [

{

"tier_index": [1],

"original_price": 30,

"model_sku": "sku-black",

"seller_stock": [
{
"stock": 300
}
]}]}2.Adding variants that change tier structureScenario 2: The product has defined color specifications, the colors are red and blue, now you need to add size specifications, the sizes include L and XL.
 
Original Variant situation:
tier_indexoptionmodel_idtier_index[0]red10000tier_index[1]blue20000 
Variant situation that change after:
tier_indexoptionmodel_idtier_index[0,0]red,L-tier_index[0,1]red,XL-tier_index[1,0]blue,L-tier_index[1,1]blue,XL- 
*Because the tier structure has been changed, the original model information will be removed after calling API: v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1),  which means the original model_id: 10000 and model_id: 20000 will be invalid.
 
API: v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1) 
Request example:
{

  "item_id": 100918691,

  "tier_variation": [

    {

      "option_list": [

        {

          "option": "red"

        },

        {

          "option": "blue"

        }

      ],

      "name": "color"

    },

    {

      "option_list": [

        {

          "option": "L"

        },

        {

          "option": "XL"

        }

      ],

      "name": "size"

    }

  ],

  "model": [

    {

      "original_price": 10,

      "model_sku": "sku-red-L",

      "normal_stock": 100,

      "tier_index": [0,0]

    },

    {

      "original_price":20,

      "model_sku": "sku-red-XL",

      "normal_stock":200,

      "tier_index": [0,1]

    },

    {

      "original_price":30,

      "model_sku": "sku-blue-L",

      "normal_stock":300,

      "tier_index": [1,0]

    },

   {

      "original_price":40,

      "model_sku": "sku-blue-XL",

      "normal_stock":400,

      "tier_index": [1,1]

    }

  ]

}
 
3.Deleting variants with same tier structureScenario 3: The product has defined color specifications with colors red, blue, and black, and now the blue color needs to be deleted.
 
Original variant situation:
tier_indexoptionmodel_idtier_index[0]red10000tier_index[1] (To be deleted）blue  (To be deleted）20000tier_index[2]black30000 
Because to delete the blue color, the tier_index can only be tier_index[0], tier_index[1] after deletion, so we need to overwrite the information of the variant at tier_index[1] with the information of the black variant.
 
Variants situation after deletion
tier_indexoptionmodel_idtier_index[0]red10000tier_index[1] black30000 
API: v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1) to remove option and overwrite the model information at the same time.
Request example:
{

    "item_id": 800250275,

    "tier_variation": [

        {

            "name": "color",

            "option_list": [

                {

                    "option": "red"

                },  

               {

                    "option": "black"

                }

            ]

        }

    ],

    "model_list": [

        {

            "tier_index": [0],

            "model_id": 10000

        },

        {

            "tier_index": [1],

            "model_id": 30000

        }

    ]

} 
Scenario 4: The product has defined color and size specifications, color is red, blue, size is L, XL, and now all the blue variants need to be deleted.
 
Original variant situation
tier_indexoptionmodel_idtier_index[0,0]red,L10000tier_index[0,1]red,XL20000tier_index[1,0] (To be deleted）blue,L (To be deleted）30000tier_index[1,1] (To be deleted）blue,XL  (To be deleted）40000 
API: v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1) to delete both option and model information at the same time.
Request example:
{

    "item_id": 800250275,

    "tier_variation": [

        {

            "name": "color",

            "option_list": [

                {

                    "option": "red"

                }

            ]

        },

     {

            "name": "size",

            "option_list": [

              {

                    "option": "L"

                },

                {

                    "option": "XL"

                }

            ]

        }

    ],

    "model_list": [

        {

            "tier_index": [0,0],

            "model_id": 10000

        },

        {

            "tier_index": [0,1],

            "model_id": 20000

        }

    ]

}

 
Variants situation after deletion
tier_indexoptionmodel_idtier_index[0,0]red,L10000tier_index[0,1]red,XL20000tier_index[1,0] --tier_index[1,1]--4.Deleting variants that change tier structureScenario 5: The product has defined color and size specifications, color is red, blue, size is L, XL, and now all colors need to be deleted.
 
Original variant situation:
tier_indexoptionmodel_idtier_index[0,0]red,L10000tier_index[0,1]red,XL20000tier_index[1,0] blue,L 30000tier_index[1,1]blue,XL40000 
Variant situation after deletion:
tier_indexoptionmodel_idtier_index[0]L-tier_index[1]XL- 
 
API: v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1)
Request example:
{

  "item_id": 100918691,

  "tier_variation": [

    {

      "option_list": [

        {

          "option": "L"

        },

        {

          "option": "XL"

        }

      ],

      "name": "size"

  ],

  "model": [

    {

      "original_price": 10,

      "model_sku": "sku-L",

      "normal_stock": 100,

      "tier_index": [0]

    },

    {

      "original_price":20,

      "model_sku": "sku-XL",

      "normal_stock":200,

      "tier_index": [1]

    }  ]

}5.Changing the order of variantsScenario 6: The item has defined color specifications with colors red and blue. Now the color order needs to be changed to blue, red, with the original variant information retained.
 
Original variant situation
tier_indexoptionmodel_idtier_index[0]red10000tier_index[1]blue20000 
Variant situation after change:
tier_indexoptionmodel_idtier_index[0]blue20000tier_index[1]red10000 
API: v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1)
Request example:
{

    "item_id": 800250275,

    "tier_variation": [

        {

            "name": "color",

            "option_list": [

                {

                    "option": "blue"

                },  

               {

                    "option": "red"

                }

            ]

        }

    ],

    "model_list": [

        {

            "tier_index": [0],

            "model_id": 20000

        },

        {

            "tier_index": [1],

            "model_id": 10000

        }

    ]

}6.Changing the option name of the variant 
Scenario 7: The item has defined a color specification with the colors red and blue. Now the color name needs to be changed to red-A, blue.
 
Original variant situation
tier_indexoptionmodel_idtier_index[0]red10000tier_index[1]blue20000Variant situation after change:
tier_indexoptionmodel_idtier_index[0]red-A10000tier_index[1]blue20000 
API: v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1) 
Request example:
{

    "item_id": 800250275,

    "tier_variation": [

        {

            "name": "color",

            "option_list": [

                {

                    "option": "red-A"

                },  

               {

                    "option": "blue"

                }

            ]

        }

    ],

    "model_list": [

        {

            "tier_index": [0],

            "model_id": 10000

        },

        {

            "tier_index": [1],

            "model_id": 20000

        }

    ]

}Summary1.The function of v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1) API, including changing 0-tier variation to 1-tier variation / 0-tier variation to 2-tier variation / 1-tier variation to 2-tier variation / 2-tier variation to 1-tier variation.
2.The function of v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1) API, including add/delete/update the options, If you still need to keep the original variants information, please use the model_list field.
3. The function of v2.product.add_model (https://open.shopee.com/documents/v2/v2.product.add_model?module=89&type=1) API is adding the new model information, the function of  v2.product.delete_model (https://open.shopee.com/documents/v2/v2.product.delete_model?module=89&type=1) API is deleting the variant information.
4. Sellers who have upgraded CNSC and KRSC can only add/delete variants through global products, so please use the global product API for management, otherwise an error will be reported.
Global Product APIProduct APIv2.global_product.init_tier_variation (https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&type=1)v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1)v2.global_product.update_tier_variation (https://open.shopee.com/documents/v2/v2.global_product.update_tier_variation?module=90&type=1)v2.product.update_tier_variation (https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&type=1)v2.global_product.add_global_model (https://open.shopee.com/documents/v2/v2.global_product.add_global_model?module=90&type=1)v2.product.add_model (https://open.shopee.com/documents/v2/v2.product.add_model?module=89&type=1)v2.global_product.delete_global_model (https://open.shopee.com/documents/v2/v2.global_product.delete_global_model?module=90&type=1)v2.product.delete_model (https://open.shopee.com/documents/v2/v2.product.delete_model?module=89&type=1)

## Content (raw HTML)

```html
<p>Shopee supports defining variant structures with up to two levels of specifications. The total number of variants cannot exceed 50.</p><p>For example, if an item has a color specification, the color is red, or blue, we call this 1-tier variation.</p><p>For example, if the product has color and size specifications, color is red, blue, size is L, XL, we call this 2-tier variation.</p><p>&nbsp;</p><p>To add variants when creating an item, please refer to the article on <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/211"><u>Creating product</u></a>.</p><p>To manage variants after creating an item, please refer to this article.&nbsp;</p><p>To manage the stock and price of a variation, please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/223"><u>Stock and Price Management</u></a> article.</p><h1>1. Adding variants with same tier structure</h1><p>Scenario 1: The product has already defined color specifications with red and blue colors, now you need to add black for the middle position of option.</p><p>Variant situation:</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>red</td><td>10000</td></tr><tr><td>tier_index[1]&nbsp; (To be added）</td><td>black (To be added）</td><td>-</td></tr><tr><td>tier_index[2]</td><td>blue</td><td>20000</td></tr></tbody></table></figure><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><strong><u>v2.product.update_tier_variation</u></strong></a><strong> + </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.add_model?module=89&amp;type=1"><strong><u>v2.product.add_model</u></strong></a></p><p>&nbsp;</p><p>1.1 Call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><u>v2.product.update_tier_variation</u></a> API to add a black option first</p><p>Request example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"item_id": 800250275,

 &nbsp;&nbsp;&nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Color",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "red"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "black"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "blue"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;"model_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 10000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [2],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 20000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}</code></pre><p>&nbsp;</p><p>&nbsp;</p><p>1.2 Call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.add_model?module=89&amp;type=1"><u>v2.product.add_model</u></a> API to add price, stock, SKU information for the black variant:</p><p>Request example:</p><pre><code class="json hljs">{

"item_id": 800250275,

"model_list": [

{

"tier_index": [1],

"original_price": 30,

"model_sku": "sku-black",

"seller_stock": [
{
"stock": 300
}
]}]}</code></pre><h1>2.Adding variants that change tier structure</h1><p>Scenario 2: The product has defined color specifications, the colors are red and blue, now you need to add size specifications, the sizes include L and XL.</p><p>&nbsp;</p><p>Original Variant situation:</p><figure class="table"><table><thead><tr><th>tier_index</th><th>option</th><th>model_id</th></tr></thead><tbody><tr><td>tier_index[0]</td><td>red</td><td>10000</td></tr><tr><td>tier_index[1]</td><td>blue</td><td>20000</td></tr></tbody></table></figure><p>&nbsp;</p><p>Variant situation that change after:</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0,0]</td><td>red,L</td><td>-</td></tr><tr><td>tier_index[0,1]</td><td>red,XL</td><td>-</td></tr><tr><td>tier_index[1,0]</td><td>blue,L</td><td>-</td></tr><tr><td>tier_index[1,1]</td><td>blue,XL</td><td>-</td></tr></tbody></table></figure><p>&nbsp;</p><p>*Because the tier structure has been changed, the original model information will be removed after calling API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><u>v2.product.init_tier_variation</u></a>,&nbsp; which means the original model_id: 10000 and model_id: 20000 will be invalid.</p><p>&nbsp;</p><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><strong><u>v2.product.init_tier_variation</u></strong></a><strong>&nbsp;</strong></p><p>Request example:</p><pre><code class="json hljs">{

 &nbsp;"item_id": 100918691,

 &nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "red"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "blue"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "color"

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "L"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "XL"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "size"

 &nbsp;&nbsp;&nbsp;}

 &nbsp;],

 &nbsp;"model": [

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 10,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku-red-L",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 100,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,0]

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price":20,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku-red-XL",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock":200,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,1]

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price":30,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku-blue-L",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock":300,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1,0]

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price":40,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku-blue-XL",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock":400,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1,1]

 &nbsp;&nbsp;&nbsp;}

 &nbsp;]

}
</code></pre><p>&nbsp;</p><h1>3.Deleting variants with same tier structure</h1><p>Scenario 3: The product has defined color specifications with colors red, blue, and black, and now the blue color needs to be deleted.</p><p>&nbsp;</p><p>Original variant situation:</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>red</td><td>10000</td></tr><tr><td>tier_index[1] (To be deleted）</td><td>blue&nbsp; (To be deleted）</td><td>20000</td></tr><tr><td>tier_index[2]</td><td>black</td><td>30000</td></tr></tbody></table></figure><p>&nbsp;</p><p>Because to delete the blue color, the tier_index can only be tier_index[0], tier_index[1] after deletion, so we need to overwrite the information of the variant at tier_index[1] with the information of the black variant.</p><p>&nbsp;</p><p>Variants situation after deletion</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>red</td><td>10000</td></tr><tr><td>tier_index[1]&nbsp;</td><td>black</td><td>30000</td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><strong><u>v2.product.update_tier_variation</u></strong></a><strong> </strong>to remove option and overwrite the model information at the same time.</p><p>Request example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"item_id": 800250275,

 &nbsp;&nbsp;&nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "color",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "red"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp; 

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "black"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;"model_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 10000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 30000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}</code></pre><p>&nbsp;</p><p>Scenario 4: The product has defined color and size specifications, color is red, blue, size is L, XL, and now all the blue variants need to be deleted.</p><p>&nbsp;</p><p>Original variant situation</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0,0]</td><td>red,L</td><td>10000</td></tr><tr><td>tier_index[0,1]</td><td>red,XL</td><td>20000</td></tr><tr><td>tier_index[1,0] (To be deleted）</td><td>blue,L (To be deleted）</td><td>30000</td></tr><tr><td>tier_index[1,1] (To be deleted）</td><td>blue,XL&nbsp; (To be deleted）</td><td>40000</td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><strong><u>v2.product.update_tier_variation</u></strong></a> to delete both option and model information at the same time.</p><p>Request example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"item_id": 800250275,

 &nbsp;&nbsp;&nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "color",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "red"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "size",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "L"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "XL"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;"model_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 10000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 20000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}

</code></pre><p>&nbsp;</p><p>Variants situation after deletion</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0,0]</td><td>red,L</td><td>10000</td></tr><tr><td>tier_index[0,1]</td><td>red,XL</td><td>20000</td></tr><tr><td>tier_index[1,0]&nbsp;</td><td>-</td><td>-</td></tr><tr><td>tier_index[1,1]</td><td>-</td><td>-</td></tr></tbody></table></figure><h1>4.Deleting variants that change tier structure</h1><p>Scenario 5: The product has defined color and size specifications, color is red, blue, size is L, XL, and now all colors need to be deleted.</p><p>&nbsp;</p><p>Original variant situation:</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0,0]</td><td>red,L</td><td>10000</td></tr><tr><td>tier_index[0,1]</td><td>red,XL</td><td>20000</td></tr><tr><td>tier_index[1,0]&nbsp;</td><td>blue,L&nbsp;</td><td>30000</td></tr><tr><td>tier_index[1,1]</td><td>blue,XL</td><td>40000</td></tr></tbody></table></figure><p>&nbsp;</p><p>Variant situation after deletion:</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>L</td><td>-</td></tr><tr><td>tier_index[1]</td><td>XL</td><td>-</td></tr></tbody></table></figure><p>&nbsp;</p><p>&nbsp;</p><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><strong><u>v2.product.init_tier_variation</u></strong></a></p><p>Request example:</p><pre><code class="json hljs">{

 &nbsp;"item_id": 100918691,

 &nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "L"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "XL"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "size"

 &nbsp;],

 &nbsp;"model": [

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 10,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku-L",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 100,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0]

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price":20,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku-XL",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock":200,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1]

 &nbsp;&nbsp;&nbsp;}&nbsp; ]

}</code></pre><h1>5.Changing the order of variants</h1><p>Scenario 6: The item has defined color specifications with colors red and blue. Now the color order needs to be changed to blue, red, with the original variant information retained.</p><p>&nbsp;</p><p>Original variant situation</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>red</td><td>10000</td></tr><tr><td>tier_index[1]</td><td>blue</td><td>20000</td></tr></tbody></table></figure><p>&nbsp;</p><p>Variant situation after change:</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>blue</td><td>20000</td></tr><tr><td>tier_index[1]</td><td>red</td><td>10000</td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><strong><u>v2.product.update_tier_variation&nbsp;</u></strong></a></p><p>Request example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"item_id": 800250275,

 &nbsp;&nbsp;&nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "color",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "blue"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp; 

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "red"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;"model_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 20000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 10000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}</code></pre><h1>6.Changing the option name of the variant</h1><p>&nbsp;</p><p>Scenario 7: The item has defined a color specification with the colors red and blue. Now the color name needs to be changed to red-A, blue.</p><p>&nbsp;</p><p>Original variant situation</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>red</td><td>10000</td></tr><tr><td>tier_index[1]</td><td>blue</td><td>20000</td></tr></tbody></table></figure><p>Variant situation after change:</p><figure class="table"><table><tbody><tr><td>tier_index</td><td>option</td><td>model_id</td></tr><tr><td>tier_index[0]</td><td>red-A</td><td>10000</td></tr><tr><td>tier_index[1]</td><td>blue</td><td>20000</td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><strong><u>v2.product.update_tier_variation</u></strong></a><strong>&nbsp;</strong></p><p>Request example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"item_id": 800250275,

 &nbsp;&nbsp;&nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "color",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "red-A"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp; 

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "blue"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;"model_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 10000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 20000

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}</code></pre><h1>Summary</h1><p>1.The function of <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><u>v2.product.init_tier_variation</u></a> API, including changing 0-tier variation to 1-tier variation / 0-tier variation to 2-tier variation / 1-tier variation to 2-tier variation / 2-tier variation to 1-tier variation.</p><p>2.The function of&nbsp;<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><u> v2.product.update_tier_variation</u></a> API, including add/delete/update the options, If you still need to keep the original variants information, please use the model_list field.</p><p>3. The function of <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.add_model?module=89&amp;type=1"><u>v2.product.add_model</u></a> API is adding the new model information, the function of&nbsp; <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.delete_model?module=89&amp;type=1"><u>v2.product.delete_model</u></a> API is deleting the variant information.</p><p>4. Sellers who have upgraded CNSC and KRSC can only add/delete variants through global products, so please use the global product API for management, otherwise an error will be reported.</p><figure class="table"><table><tbody><tr><td>Global Product API</td><td>Product API</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&amp;type=1"><u>v2.global_product.init_tier_variation</u></a></td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><u>v2.product.init_tier_variation</u></a></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.update_tier_variation?module=90&amp;type=1"><u>v2.global_product.update_tier_variation</u></a></td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_tier_variation?module=89&amp;type=1"><u>v2.product.update_tier_variation</u></a></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.add_global_model?module=90&amp;type=1"><u>v2.global_product.add_global_model</u></a></td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.add_model?module=89&amp;type=1"><u>v2.product.add_model</u></a></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.delete_global_model?module=90&amp;type=1"><u>v2.global_product.delete_global_model</u></a></td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.delete_model?module=89&amp;type=1"><u>v2.product.delete_model</u></a></td></tr></tbody></table></figure><p>&nbsp;</p><p>&nbsp;</p>
```
