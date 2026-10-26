# Creating product

> **Source:** [https://open.shopee.com/developer-guide/211](https://open.shopee.com/developer-guide/211)
> **Type:** Developer Guide / Overview
> **document_id:** `211`
> **Section:** API Guidelines and Flows

## Content

Once you have obtained the product base data, you can start creating products.
1. Uploading media filesImages and videos of your products need to be pre-stored in Shopee's media space. So you need to call the MediaSpace API to upload first.
1.1 Uploading imageAPI: v2.media_space.upload_image (https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&type=1) 
 
Each product must have product images, in addition, we also support insert images to product description. And the product image files need to meet the following requirements:
- Image size: maximum 10MB
- Image format: JPG, JPEG, PNG
 
Please note:
- V2.media_space.upload_image (https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&type=1) API we only support image file upload, not support URL. When the image is uploaded successfully, you will get the Shopee image URL accessible in each region and a unique image_id. We recommend that you link the Shopee image URL based on the shop region. image_id is for creating products and updating the product image information.
- If you upload a product image, the request parameter scene should be normal; if you upload a product description image, the request parameter scene should be desc, because the product image we will handle as a square image, the description image we will not handle.
 
1.2 Uploading videoProduct video is optional, we support video files with the following requirements:
- Video size: max 30MB
- Video length: 10s~60s
- Video format: mp4
- Video pixel requirements: pixel width and height no more than 1280px * 1280px
If your video file is over 4M, you need to split the video file, for example, a 10MB video, you need to split it into 4M, 4M and 2M fragments, because each fragment cannot be larger than 4M.
 
Uploading product videos need four steps:
 
- Step 1: Call the v2.media_space.init_video_upload (https://open.shopee.com/documents/v2/v2.media_space.init_video_upload?module=91&type=1) API. Create a video upload task and get the video_upload_id. Please note that regardless of whether your video has a partition or not, file_md5 needs to upload the md5 value of the full video file and file_size is also for the full video file.
- Step 2: Call the v2.media_space.upload_video_part (https://open.shopee.com/documents/v2/v2.media_space.upload_video_part?module=91&type=1) API. When the video file has fragments, the part_seq (should start from 0)  parameter indicates the fragments sequence number, part_content parameter indicates the fragments file. Please finish uploading all the fragments.
- Step 3: Call the v2.media_space.complete_video_upload (https://open.shopee.com/documents/v2/v2.media_space.complete_video_upload?module=91&type=1) API. Video transcoding, when you call this API, Shopee will transcode all the video fragments files you uploaded. The part_seq_list parameter takes the sequence number of all the parts you uploaded, for example, if you uploaded 2 parts, the part_seq_list will be [0,1]. For the upload_cost field you can upload the time of using the upload_video_part API for one video file.
- Step 4: Call the v2.media_space.get_video_upload_result (https://open.shopee.com/documents/v2/v2.media_space.get_video_upload_result?module=91&type=1) API. Get the video transcoding result. Since video transcoding takes some time, you can get the result by calling the v2.media_space.get_video_upload_result (https://open.shopee.com/documents/v2/v2.media_space.get_video_upload_result?module=91&type=1) API or by subscribing to the Video upload push (https://open.shopee.com/push-mechanism/11). Only when the returned status is SUCCEEDED, you can get the Shopee video URLs and video cover image URLs which are accessible to each market, and at that time, the video_upload_id can be used to create or update the video information of the product.
 
 
After uploading images and videos, you can call v2.product.add_item (https://open.shopee.com/documents/v2/v2.product.add_item?module=89&type=1) API to create products, the following will explain some points that need attention in calling v2.product.add_item (https://open.shopee.com/documents/v2/v2.product.add_item?module=89&type=1) API.
2. Uploading category and attributes2.1 Uploading categoryProducts must have category_id. You can only select the leaf category ID in the category tree for the product, otherwise, the API will return an error with Invalid category id.
2.2 Uploading attributesProducts must upload all required attributes (attributes with "mandatory": true in the "v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)" API response are considered required). You can refer to the article "Product creation preparation" to learn more about different attribute types. Below are explanations of how to upload different attribute types when calling the "v2.product.add_item" API.
 
When uploading the attribute with "input_type": 1 (SINGLE_DROP_DOWN), you can only upload one "value_id", and this "value_id" must be one of the values from the attribute list returned by the “v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)” API.
 
Example 1
"attribute_list": [
    {
        "attribute_id": 100036,
        "attribute_value_list": [
            {
                "value_id": 678
            }
        ]
    }
] 
When uploading the attribute with "input_type": 4 (MULTI_DROP_DOWN), you can upload multiple "value_id" values, and these "value_id" values must be be from the attribute list returned by the "v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)" API.
 
Example 2
"attribute_list": [
    {
        "attribute_id": 100036,
        "attribute_value_list": [
            {
                "value_id": 678
            },
            {
                "value_id": 679
            }
        ]
    }
] 
When uploading the attribute with "input_type": 3 (FREE_TEXT_FILED), you can only upload one "value_id" and specify a custom value. Therefore, you must upload “value_id”: 0 and provide the custom value in the “original_value_name” field.
 
Example 3
"attribute_list": [
    {
        "attribute_id": 100061,
        "attribute_value_list": [
            {
                "value_id": 0,
                "original_value_name": "customized name"
            }
        ]
    }
] 
i) If the attribute has “input_type”: 3 (FREE_TEXT_FIELD) and requires a unit, you must upload the “value_unit” field as well. (That is, "input_type": 3 & "format_type": 2 (FORMAT_QUANTITATIVE_WITH_UNIT))
 
Example 4
"attribute_list": [
    {
        "attribute_id": 100061,
        "attribute_value_list": [
            {
                "value_id": 0,
                "original_value_name": "12",
                "value_unit": "g"
            }
        ]
    }
] 
ii) If the attribute has “input_type”: 3 (FREE_TEXT_FIELD) and requires a date type, you must upload a timestamp in the "original_value_name" field. (That is, "input_type": 3 & "input_validation_type": 4)
 
Example 5
"attribute_list": [
    {
        "attribute_id": 100061,
        "attribute_value_list": [
            {
                "value_id": 0,
                "original_value_name": "1634526913"
            }
        ]
    }
]
] 
For the attribute with "input_type": 2 (SINGLE_COMBO_BOX), you can only upload one "value_id". This "value_id" must be one of the values from the attribute list returned by the "v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)" API (please refer to Example 1) or a user-defined value (please refer to Example 3). If a unit is required, please refer to Example 4. If a date type is required, please refer to Example 5.
 
For the attribute with "input_type": 5 (MULTI_COMBO_BOX), you can upload multiple "value_id" values from the attribute list returned by the "v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)" API, or specify custom values.
 
Example 6
"attribute_list": [
    {
        "attribute_id": 100061,
        "attribute_value_list": [
            {
                "value_id": 0,
                "original_value_name": "customized name"
            },
            {
                "value_id": 678
            }
        ]
    }
] 
If a unit is required, please refer to Example 4. If a date type is required, please refer to Example 5.
 
Summary:
1) For all attribute types, you must upload a "value_id". When uploading a user-defined value, "value_id" must be 0 and "original_value_name" is required.
2) Regardless of the data type of the value, the "original_value_name" field must be uploaded in string format.
3) When "format_type" is 2 and you upload a user-defined value, you must also upload the "value_unit" field, and the unit should be selected from the "attribute_unit_list" in the response of the "v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)" API. 
 
3. Uploading description*Please note that we currently support whitelisted sellers to use extended_description, please refer to the FAQ (https://open.shopee.com/faq?top=162&sub=166&page=1&faq=218) for details on how to use it.
4. Uploading priceExcept for SG/MY/BR/MX/PL markets, we support sellers to upload two decimal prices (original_price), for other marketplaces, only integers are supported, if sellers fill in decimals, we will do rounding.
5. Uploading stockIf the seller does not have a stock warehouse (currently only used by whitelist users) then there is no need to upload the location_id field.
6. Uploading shipment channels and shipping feeDepending on how the channel calculates the shipping fee, we have divided the channels into several types, you can get the fee_type through v2.logistics.get_channel_list (https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&type=1) API, the types including:
- SIZE_SELECTION: The shipping fee is calculated based on the size ID
- SIZE_INPUT: The shipping fee is calculated according to the specific product dimension, so for this type, the seller needs to upload the length, width ,height and weight for the product.
- FIXED_DEFAULT_PRICE: Fixed shipping fee.
- CUSTOM_PRICE: shipping fee can be customized by the seller.
 
The seller can choose multiple channels for the product.
i)enabled=true means the product is open to this channel and the buyer can choose.
ii) is_free=true means the seller bears the shipping fee, i.e. the product is shipped, the buyer does not need to bear the shipping fee, and all channel types support setting up shipping.
 
1) For the SIZE_SELECTION channel, the size_id must be uploaded, and size_id can be obtained through v2.logistics.get_channel_list (https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&type=1) API.
Example 1:
 "logistic_info":[
    {
            "sizeid":1,
            "enabled":true,
            "is_free":false,
            "logistic_id":80101
        }]
 
2）For the SIZE_INPUT channel, the weight and dimension must be uploaded.
Example2:
    "weight": 1,
   "dimension":{
        "package_height":11,
        "package_length":11,
        "package_width":11
    },
 "logistic_info":[
    {
            "enabled":true,
            "is_free":false,
            "logistic_id":80101
        }]
 
3）For the CUSTOM_PRICE channel, the shipping_fee must be uploaded.
Exapmle 3：
  "logistic_info":[
        {
            "shipping_fee":23.12,
            "enabled":true,
            "is_free":false,
            "logistic_id":80103
        }]
"logistic_info":[
        {
       
            "enabled":true,
            "logistic_id":80103
        }]
7. Creating VariantsWhen you create the item successfully, v2.product.add_item (https://open.shopee.com/documents/v2/v2.product.add_item?module=89&type=1) will return the item_id, which is the unique identifier of the item. If you also need to define specifications and create multiple option variants, such as the color and size, you can call v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1) API for the next step. We will create model_id for each variation, which will be the unique identifier of the variation.
 
Scenario 1: The product has size specifications and the size contains XS, S, and M. We call this 1-tier variation product.
 
tier_indexsizepricestockSKUtier_index[0]XS10010sku1tier_index[1]S20020sku2tier_index[2]M30030sku3 
 
v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1) API request example:
{

    "item_id": 800188562,

    "tier_variation": [

        {

            "name": "size",

            "option_list": [

                {

                    "option": "XS",

                    "image": {"image_id":"82becb4830bd2ee90ad6acf8a9dc26d7"}

                },

                {

                    "option": "S",

        "image": {"image_id":"72becb4830bd2ee90ad6acf879dc26d7"}

                },

                {

                    "option": "M",

      "image": {"image_id":"92becb4830bd2ee90ad6acf8a9dc26d7"}

                }

            ]

        }

    ],

    "model": [

        {

            "tier_index": [0],

            "original_price": 100,

            "model_sku": "sku1",

            "normal_stock": 10

        },

        {

            "tier_index": [1],

            "original_price": 200,

            "model_sku": "sku1",

            "normal_stock": 20

        },

       {

            "tier_index": [2],

            "original_price": 300,

            "model_sku": "sku3",

            "normal_stock": 30

        }

    ]

} 
 
 
Scenario 2: The product has color and size specifications, the color includes red and blue, and the size includes XL and L. We call this 2-tier variation product.
 
tier_indexcolorsizepricestockSKUtier_index[0,0]RedXL10010sku1tier_index[0,1]RedL20020sku2tier_index[1,0]BlueXL30030sku3tier_index[1,1]BlueL40040sku4 
v2.product.init_tier_variation (https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&type=1) API request example:
 {

  "item_id": 100917481,

  "tier_variation": [

    {

      "name": "color",

      "option_list": [

        {

          "image": {"image_id": "82becb4830bd2ee90ad6acf8a9dc26d7"},

          "option": "Red"

        },

        {

          "image": {"image_id": "72becb4830bd2ee90ad6acf879dc26d7"},

          "option": "Blue"

        }

      ]

    },

    {

      "name": "size",

      "option_list": [

        {

          "option": "XL"

        },

        {

          "option": "L"

        }

      ]

    }

  ],

  "model": [

     { 

      "tier_index": [0,0],

      "original_price": 100,

      "normal_stock": 10,

      "global_model_sku": "sku1"

    },

    {

     "tier_index": [0,1],

      "original_price": 200,

      "normal_stock": 20,

      "global_model_sku": "sku2"

    },

    {

      "tier_index": [1,0],

      "original_price": 300,

      "normal_stock": 30,

      "global_model_sku": "sku3"

    },

    {

     "tier_index": [1,1],

      "original_price": 400,

      "normal_stock": 40,

      "global_model_sku": "sku4"

    }

  ]

} 
Please note that
1. The options you define will be displayed on the Shopee mall side in order. Shopee currently only supports the definition of up to 2-tier variation.
2. You can define an image for each variant. If it is a 2-tier variation product, you can only define the first layer of options, that is, in the example, you can define variant images based on color, but not based on size. Once you want to add variant images, all the options in the first layer need to define the image. The image needs to be uploaded by calling the v2.media_space.upload_image (https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&type=1) API first.
3. The tier_index must start from 0 and not overflow, otherwise an error will be reported.
*4.It is recommended that you create variants after an interval of 5 seconds after creating an item, because there may be a delay in creating item data.
5. After successful creation you can call v2.product.get_model_list (https://open.shopee.com/documents/v2/v2.product.get_model_list?module=89&type=1) API to get the model id corresponding to each tier_index.

## Content (raw HTML)

```html
<p>Once you have obtained the product base data, you can start creating products.</p><h1>1. Uploading media files</h1><p>Images and videos of your products need to be <strong>pre-stored</strong> in Shopee's media space. So you need to call the MediaSpace API to upload first.</p><h2>1.1 Uploading image</h2><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&amp;type=1"><u>v2.media_space.upload_image</u></a>&nbsp;</p><p>&nbsp;</p><p>Each product must have product images, in addition, we also support insert images to product description. And the product image files need to meet the following requirements:</p><ul><li>Image size: maximum 10MB</li><li>Image format: JPG, JPEG, PNG</li></ul><p>&nbsp;</p><p>Please note:</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&amp;type=1"><u>V2.media_space.upload_image</u></a> API we only support image file upload, not support URL. When the image is uploaded successfully, you will get the Shopee image URL accessible in each region and a unique image_id. We recommend that you link the Shopee image URL based on the shop region. image_id is for creating products and updating the product image information.</li><li>If you upload a product image, the request parameter <strong>scene</strong> should be normal; if you upload a product description image, the request parameter scene should be desc, because the product image we will handle as a square image, the description image we will not handle.</li></ul><p>&nbsp;</p><h2>1.2 Uploading video</h2><p>Product video is optional, we support video files with the following requirements:</p><ul><li>Video size: max 30MB</li><li>Video length: 10s~60s</li><li>Video format: mp4</li><li>Video pixel requirements: pixel width and height no more than 1280px * 1280px</li></ul><p>If your video file is over 4M, you need to split the video file, for example, a 10MB video, you need to split it into 4M, 4M and 2M fragments, because each fragment cannot be larger than 4M.</p><p>&nbsp;</p><p>Uploading product videos need four steps:</p><p>&nbsp;</p><ul><li>Step 1: Call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.init_video_upload?module=91&amp;type=1">v<u>2.media_space.init_video_upload</u></a> API. Create a video upload task and get the video_upload_id. Please note that regardless of whether your video has a partition or not, <strong>file_md5 needs to upload the md5 value of the full video file</strong> and file_size is also for the full video file.</li><li>Step 2: Call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.upload_video_part?module=91&amp;type=1"><u>v2.media_space.upload_video_part</u></a> API. When the video file has fragments, the part_seq (should start from 0)&nbsp; parameter indicates the fragments sequence number, part_content parameter indicates the fragments file. Please finish uploading all the fragments.</li><li>Step 3: Call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.complete_video_upload?module=91&amp;type=1"><u>v2.media_space.complete_video_upload</u></a> API. Video transcoding, when you call this API, Shopee will transcode all the video fragments files you uploaded. The part_seq_list parameter takes the sequence number of all the parts you uploaded, for example, if you uploaded 2 parts, the part_seq_list will be [0,1]. For the upload_cost field you can upload the time of using the upload_video_part API for one video file.</li><li>Step 4: Call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.get_video_upload_result?module=91&amp;type=1"><u>v2.media_space.get_video_upload_result</u></a> API. Get the video transcoding result. Since video transcoding takes some time, you can get the result by calling the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.get_video_upload_result?module=91&amp;type=1"><u>v2.media_space.get_video_upload_result</u></a> API or by subscribing to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/11"><u>Video upload push</u></a>. Only when the returned status is SUCCEEDED, you can get the Shopee video URLs and video cover image URLs which are accessible to each market, and at that time, the video_upload_id can be used to create or update the video information of the product.</li></ul><p>&nbsp;</p><p>&nbsp;</p><p>After uploading images and videos, you can call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.add_item?module=89&amp;type=1"><u>v2.product.add_item</u></a> API to create products, the following will explain some points that need attention in calling <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.add_item?module=89&amp;type=1"><u>v2.product.add_item</u></a> API.</p><h1>2. Uploading category and attributes</h1><h2>2.1 Uploading category</h2><p>Products must have category_id. You can only select the leaf category ID in the category tree for the product, otherwise, the API will return an error with Invalid category id.</p><h2>2.2 Uploading attributes</h2><p>Products must upload all required attributes (attributes with "mandatory": true in the "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a>" API response are considered required). You can refer to the article "Product creation preparation" to learn more about different attribute types. Below are explanations of how to upload different attribute types when calling the "v2.product.add_item" API.</p><p>&nbsp;</p><p>When uploading the attribute with "input_type": 1 (SINGLE_DROP_DOWN), you can only upload one "value_id", and this "value_id" must be one of the values from the attribute list returned by the “<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a>” API.</p><p>&nbsp;</p><p>Example 1</p><pre><code class="json hljs">"attribute_list": [
 &nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_id": 100036,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 678
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;}
]</code></pre><p>&nbsp;</p><p>When uploading the attribute with "input_type": 4 (MULTI_DROP_DOWN), you can upload multiple "value_id" values, and these "value_id" values must be be from the attribute list returned by the "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a>" API.</p><p>&nbsp;</p><p>Example 2</p><pre><code class="json hljs">"attribute_list": [
 &nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_id": 100036,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 678
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 679
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;}
]</code></pre><p>&nbsp;</p><p>When uploading the attribute with "input_type": 3 (FREE_TEXT_FILED), you can only upload one "value_id" and specify a custom value. Therefore, you must upload “value_id”: 0 and provide the custom value in the “original_value_name” field.</p><p>&nbsp;</p><p>Example 3</p><pre><code class="json hljs">"attribute_list": [
 &nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_id": 100061,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 0,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_value_name": "customized name"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;}
]</code></pre><p>&nbsp;</p><p>i) If the attribute has “input_type”: 3 (FREE_TEXT_FIELD) and requires a unit, you must upload the “value_unit” field as well. (That is, "input_type": 3 &amp; "format_type": 2 (FORMAT_QUANTITATIVE_WITH_UNIT))</p><p>&nbsp;</p><p>Example 4</p><pre><code class="json hljs">"attribute_list": [
 &nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_id": 100061,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 0,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_value_name": "12",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_unit": "g"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp; }
]</code></pre><p>&nbsp;</p><p>ii) If the attribute has “input_type”: 3 (FREE_TEXT_FIELD) and requires a date type, you must upload a timestamp in the "original_value_name" field. (That is, "input_type": 3 &amp; "input_validation_type": 4)</p><p>&nbsp;</p><p>Example 5</p><pre><code class="json hljs">"attribute_list": [
 &nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_id": 100061,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 0,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_value_name": "1634526913"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;}
]
]</code></pre><p>&nbsp;</p><p>For the attribute with "input_type": 2 (SINGLE_COMBO_BOX), you can only upload one "value_id". This "value_id" must be one of the values from the attribute list returned by the "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a>" API (please refer to Example 1) or a user-defined value (please refer to Example 3). If a unit is required, please refer to Example 4. If a date type is required, please refer to Example 5.</p><p>&nbsp;</p><p>For the attribute with "input_type": 5 (MULTI_COMBO_BOX), you can upload multiple "value_id" values from the attribute list returned by the "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a>" API, or specify custom values.</p><p>&nbsp;</p><p>Example 6</p><pre><code class="json hljs">"attribute_list": [
 &nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_id": 100061,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 0,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_value_name": "customized name"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value_id": 678
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;}
]</code></pre><p>&nbsp;</p><p>If a unit is required, please refer to Example 4. If a date type is required, please refer to Example 5.</p><p>&nbsp;</p><p><strong>Summary:</strong></p><p>1) For all attribute types, you must upload a "value_id". When uploading a user-defined value, "value_id" must be 0 and "original_value_name" is required.</p><p>2) Regardless of the data type of the value, the "original_value_name" field must be uploaded in string format.</p><p>3) When "format_type" is 2 and you upload a user-defined value, you must also upload the "value_unit" field, and the unit should be selected from the "attribute_unit_list" in the response of the "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a>" API.&nbsp;</p><p>&nbsp;</p><h1>3. Uploading description</h1><p>*Please note that we currently support whitelisted sellers to use extended_description, please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=166&amp;page=1&amp;faq=218"><u>FAQ</u></a> for details on how to use it.</p><h1>4. Uploading price</h1><p>Except for SG/MY/BR/MX/PL markets, we support sellers to upload two decimal prices (original_price), for other marketplaces, only integers are supported, if sellers fill in decimals, we will do rounding.</p><h1>5. Uploading stock</h1><p>If the seller does not have a stock warehouse (currently only used by whitelist users) then there is no need to upload the location_id field.</p><h1>6. Uploading shipment channels and shipping fee</h1><p>Depending on how the channel calculates the shipping fee, we have divided the channels into several types, you can get the fee_type through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&amp;type=1"><u>v2.logistics.get_channel_list</u></a> API, the types including:</p><ul><li><strong>SIZE_SELECTION</strong>: The shipping fee is calculated based on the size ID</li><li><strong>SIZE_INPUT</strong>: The shipping fee is calculated according to the specific product dimension, so for this type, the seller needs to upload the length, width ,height and weight for the product.</li><li><strong>FIXED_DEFAULT_PRICE</strong>: Fixed shipping fee.</li><li><strong>CUSTOM_PRICE</strong>: shipping fee can be customized by the seller.</li></ul><p>&nbsp;</p><p>The seller can choose multiple channels for the product.</p><p>i)enabled=true means the product is open to this channel and the buyer can choose.</p><p>ii) is_free=true means the seller bears the shipping fee, i.e. the product is shipped, the buyer does not need to bear the shipping fee, and all channel types support setting up shipping.</p><p>&nbsp;</p><p>1) For the <strong>SIZE_SELECTION </strong>channel, the size_id must be uploaded, and <strong>size_id</strong> can be obtained through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&amp;type=1"><u>v2.logistics.get_channel_list</u></a> API.</p><p><span style="background-color:#FFFFFF;"><i>Example 1:</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;"logistic_info":[</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;{</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sizeid":1,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled":true,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"is_free":false,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"logistic_id":80101</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}]</i></span></p><p>&nbsp;</p><p>2）For the <strong>SIZE_INPUT</strong> channel, the <strong>weight</strong> and <strong>dimension</strong> must be uploaded.</p><p><span style="background-color:#FFFFFF;"><i>Example2:</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;"weight": 1,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;"dimension":{</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"package_height":11,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"package_length":11,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"package_width":11</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;},</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;"logistic_info":[</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;{</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled":true,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"is_free":false,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"logistic_id":80101</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}]</i></span></p><p>&nbsp;</p><p>3）For the <strong>CUSTOM_PRICE</strong> channel, the <strong>shipping_fee</strong> must be uploaded.</p><p><span style="background-color:#FFFFFF;"><i>Exapmle 3：</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;"logistic_info":[</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"shipping_fee":23.12,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled":true,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"is_free":false,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"logistic_id":80103</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}]</i></span></p><p><span style="background-color:#FFFFFF;"><i>"logistic_info":[</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"enabled":true,</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"logistic_id":80103</i></span></p><p><span style="background-color:#FFFFFF;"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}]</i></span></p><h1>7. Creating Variants</h1><p>When you create the item successfully, <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.add_item?module=89&amp;type=1"><u>v2.product.add_item</u></a> will return the item_id, which is the unique identifier of the item. If you also need to define specifications and create multiple option variants, such as the color and size, you can call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><u>v2.product.init_tier_variation</u></a> API for the next step. We will create model_id for each variation, which will be the unique identifier of the variation.</p><p>&nbsp;</p><p><strong>Scenario 1:</strong> The product has size specifications and the size contains XS, S, and M. We call this 1-tier variation product.</p><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><span style="background-color:rgb(255,255,255);">tier_index</span></td><td><span style="background-color:rgb(255,255,255);">size</span></td><td><span style="background-color:rgb(255,255,255);">price</span></td><td><span style="background-color:rgb(255,255,255);">stock</span></td><td><span style="background-color:rgb(255,255,255);">SKU</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[0]</span></td><td><span style="background-color:rgb(255,255,255);">XS</span></td><td><span style="background-color:rgb(255,255,255);">100</span></td><td><span style="background-color:rgb(255,255,255);">10</span></td><td><span style="background-color:rgb(255,255,255);">sku1</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[1]</span></td><td><span style="background-color:rgb(255,255,255);">S</span></td><td><span style="background-color:rgb(255,255,255);">200</span></td><td><span style="background-color:rgb(255,255,255);">20</span></td><td><span style="background-color:rgb(255,255,255);">sku2</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[2]</span></td><td><span style="background-color:rgb(255,255,255);">M</span></td><td><span style="background-color:rgb(255,255,255);">300</span></td><td><span style="background-color:rgb(255,255,255);">30</span></td><td><span style="background-color:rgb(255,255,255);">sku3</span></td></tr></tbody></table></figure><p>&nbsp;</p><p>&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><u>v2.product.init_tier_variation</u></a> API request example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"item_id": 800188562,

 &nbsp;&nbsp;&nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "size",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "XS",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id":"82becb4830bd2ee90ad6acf8a9dc26d7"}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "S",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id":"72becb4830bd2ee90ad6acf879dc26d7"}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "M",

      "image": {"image_id":"92becb4830bd2ee90ad6acf8a9dc26d7"}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;"model": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 100,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku1",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 10

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 200,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku1",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 20

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [2],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 300,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_sku": "sku3",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 30

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}</code></pre><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);"><strong>Scenario 2:</strong> The product has color and size specifications, the color includes red and blue, and the size includes XL and L. We call this 2-tier variation product.</span></p><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><span style="background-color:rgb(255,255,255);">tier_index</span></td><td><span style="background-color:rgb(255,255,255);">color</span></td><td><span style="background-color:rgb(255,255,255);">size</span></td><td><span style="background-color:rgb(255,255,255);">price</span></td><td><span style="background-color:rgb(255,255,255);">stock</span></td><td><span style="background-color:rgb(255,255,255);">SKU</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[0,0]</span></td><td><span style="background-color:rgb(255,255,255);">Red</span></td><td><span style="background-color:rgb(255,255,255);">XL</span></td><td><span style="background-color:rgb(255,255,255);">100</span></td><td><span style="background-color:rgb(255,255,255);">10</span></td><td><span style="background-color:rgb(255,255,255);">sku1</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[0,1]</span></td><td><span style="background-color:rgb(255,255,255);">Red</span></td><td><span style="background-color:rgb(255,255,255);">L</span></td><td><span style="background-color:rgb(255,255,255);">200</span></td><td><span style="background-color:rgb(255,255,255);">20</span></td><td><span style="background-color:rgb(255,255,255);">sku2</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[1,0]</span></td><td><span style="background-color:rgb(255,255,255);">Blue</span></td><td><span style="background-color:rgb(255,255,255);">XL</span></td><td><span style="background-color:rgb(255,255,255);">300</span></td><td><span style="background-color:rgb(255,255,255);">30</span></td><td><span style="background-color:rgb(255,255,255);">sku3</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[1,1]</span></td><td><span style="background-color:rgb(255,255,255);">Blue</span></td><td><span style="background-color:rgb(255,255,255);">L</span></td><td><span style="background-color:rgb(255,255,255);">400</span></td><td><span style="background-color:rgb(255,255,255);">40</span></td><td><span style="background-color:rgb(255,255,255);">sku4</span></td></tr></tbody></table></figure><p>&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.init_tier_variation?module=89&amp;type=1"><u>v2.product.init_tier_variation</u></a><u> </u>API request example<span style="background-color:rgb(255,255,255);">:</span></p><pre><code class="json hljs"> {

 &nbsp;"item_id": 100917481,

 &nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "color",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id": "82becb4830bd2ee90ad6acf8a9dc26d7"},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "Red"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id": "72becb4830bd2ee90ad6acf879dc26d7"},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "Blue"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "size",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "XL"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "L"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;}

 &nbsp;],

 &nbsp;"model": [

 &nbsp;&nbsp;&nbsp;&nbsp;{ 

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 100,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 10,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku1"

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 200,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 20,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku2"

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1,0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 300,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 30,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku3"

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1,1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 400,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 40,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku4"

 &nbsp;&nbsp;&nbsp;}

 &nbsp;]

}</code></pre><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);"><strong>Please note that</strong></span></p><p><span style="background-color:rgb(255,255,255);">1. The options you define will be displayed on the Shopee mall side in order. </span>Shopee currently only supports the definition of up to 2-tier variation.</p><p><span style="background-color:rgb(255,255,255);">2. </span>You can define an image for each variant. If it is a 2-tier variation product, you can only define the first layer of options, that is, in the example, you can define variant images based on color, but not based on size. Once you want to add variant images, all the options in the first layer need to define the image. The image needs to be uploaded by calling the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&amp;type=1"><u>v2.media_space.upload_image</u></a> API first.</p><p><span style="background-color:rgb(255,255,255);">3. </span>The tier_index must start from 0 and not overflow, otherwise an error will be reported.</p><p><span style="background-color:rgb(255,255,255);">*4.</span>It is recommended that you create variants after an interval of 5 seconds after creating an item, because there may be a delay in creating item data.</p><p><span style="background-color:rgb(255,255,255);">5. After successful creation you can call </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_model_list?module=89&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>v2.product.get_model_list</u></span></a><span style="background-color:rgb(255,255,255);"> API to get the model id corresponding to each tier_index.</span></p><p>&nbsp;</p><p>&nbsp;</p>
```
