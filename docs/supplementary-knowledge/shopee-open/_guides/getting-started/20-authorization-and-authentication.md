# Authorization and Authentication

> **Source:** [https://open.shopee.com/developer-guide/20](https://open.shopee.com/developer-guide/20)
> **Type:** Developer Guide / Overview
> **document_id:** `20`
> **Section:** Getting Started

## Content

Authorization is an important step to using Open API. You need to be authorized by the seller in order for your App to call non-public APIs required for shop management.
 
You will be authenticated based on the public parameters passed to Open API. If the authentication fails, your call will fail and an error will be returned.
⚠️ Note 
- Authorization Validity
The maximum validity period for each authorization is 365 days. Sellers may customize the authorization expiration time during the authorization process. Once the authorization expires, you will need to contact the seller to re-authorize your App.
 
- SIP Shops Authorization
If a CB SIP primary shop grants authorization to an application, all SIP linked shops will automatically receive the same authorization. However, API access permissions for linked shops are limited. For more details, please refer to the FAQ (https://open.shopee.com/faq?top=162&sub=166&page=1&faq=214) .
The authorization process 
There are 3 steps to complete authorization: generating the authorization link, acquiring authorization from shop(s), and getting and refreshing the access_token.
 
These will be explained in detail below, along with information on what to prepare before authorization, details of the authorization process, and how to use the information returned after authorization to pass the authentication of the platform.
Generating the authorization link 
To improve integration efficiency, the platform provides a new method for generating authorization links. The authorization link is composed of a fixed authorization URL and authorization parameters. All types of Apps can generate authorization links according to the specifications below.
 
Note: 
- For Seller in House System Apps, you can log in to the Open Platform > App list > click “Authorize” > fill in Redirect URL to generate an authorization link.
- For all other type of App: there is no "Authorize" display, you need to create an authorization link with the following specifications. The authorization link comprises a fixed authorization URL and other required parameters.
 
(Seller in House System Apps)
 
(Other Apps)
 
 
Fixed authorization URL:
EnvironmentRegionURLProductionGlobal (excluding Mainland China and Brazil)https://open.shopee.com/auth (https://open.shopee.com/auth)Mainland Chinahttps://open.shopee.cn/auth (https://open.shopee.cn/auth)Brazilhttps://open.shopee.com.br/auth (https://open.shopee.com.br/auth)SandboxGlobal (excluding Mainland China and Brazil)https://open.sandbox.test-stable.shopee.com/auth (https://open.test-stable.shopee.com/auth)Mainland Chinahttps://open.sandbox.test-stable. (https://open.test-stable.shopee.com/auth)shopee.cn/auth (https://open.test-stable.shopee.cn/auth)Brazilhttps://open.sandbox.test-stable. (https://open.test-stable.shopee.com/auth)shopee.com.br/auth (https://open.test-stable.shopee.com.br/auth) 
Other required parameters:
Parameter nameTypeRequiredDescriptionpartner_idintYespartner_id obtained from the App.auth_typestringYesThe role type to be authorized. Enum values:
- seller: used when authorizing a shop or merchant;
- supplier: used when authorizing suppliers (for SCS users);
- user: used when authorizing users (for livestream-related apps, see
https://open.shopee.com/announcements/1190 (https://open.shopee.com/announcements/1190) 。
redirect_uristringYesThe URL where the authorization code (code) is received after the seller completes authorization.
 
Production environment: If the production callback URL domain of the app is empty, the redirect_uri domain is not validated; otherwise, it must match the configured production callback URL domain.
 
Sandbox environment: If the sandbox callback URL domain is empty, the redirect_uri domain is not validated; otherwise, it must match the configured sandbox callback URL domain.
response_typestringYesThe authorization type. Fixed value: "code".statestringNo                      A random, unguessable string used to prevent CSRF attacks. It will be returned as-is to the redirect_uri after authorization is completed.Redirect URL Domain Validation Requirements 
To ensure seller data security, the platform has introduced domain validation for the callback address (redirect_uri) in authorization links. All developers are required to configure the Test Redirect URL Domain and Live Redirect URL Domain for each App in the Console.
 
The redirect_uri parameter mentioned above refers to the callback URL configured in the App information page. You can view it as follows:
 
 
Notes on Redirect URL Domain Validation 
1. For Apps that have already been created but have not yet declared a callback URL domain, developers should log in to the Console and complete the configuration in the App edit page as soon as possible. Before the configuration is completed, the platform will not enforce domain validation, and the existing authorization process will not be affected.
2. If the domain of the redirect_uri parameter (or the redirect parameter in legacy links) does not match the Redirect URL Domain configured in the Console when generating an authorization link, the platform will return the following error:
"The domain of redirect_uri is not consistent with the Redirect URL Domain declared in console"
(The domain of the callback URL does not match the Redirect URL Domain declared in the Console.)
 
 Authorization Link Examples 
The following are examples of authorization links for both the Production and Sandbox environments for your reference.
 
Production Environment:
https://open.shopee.com/auth?partner_id=10090&auth_type=seller&redirect_uri=https://open.shopee.com&response_type=code (https://open.shopee.com/auth?partner_id=10090&auth_type=seller&redirect_uri=https://open.shopee.com&response_type=code) 
 
Sandbox Environment:
https://open.test-stable.shopee.com/auth?partner_id=1000016&auth_type=seller&redirect_uri=https://open.test-stable.shopee.com&response_type=code
⚠️ Note
The timestamp used to calculate the sign is only valid for 5 minutes. After the timestamp and the sign expire, the authorization link will no longer be valid, and you need to generate a new link.
Acquiring authorizations from shop(s) 
After you share the authorization link with the seller, the seller needs to log in to their account, fill in the verification code sent to their mobile phone, and enter the authorization page.
 
Account types:
- Shop account: can authorize a single shop;
- Main account: can authorize multiple merchants / shops;
- Sub-account: cannot log in to the authorization page.
Authorizing from a shop account  
1. The seller fills in their login details and selects Log In.
 
2. The seller fills in the verification code sent to their mobile phone and selects Verify.
 
3. Upon logging in, the seller selects Confirm Authorization.
 
4. The system will display an authorization validity period selector. Sellers can choose from preset durations (7 days, 30 days, 90 days, 180 days, or 365 days), or select “Customize Expiration Time” to set any expiration date within 365 days.
 
5. After authorization is completed, the frontend page will redirect to the redirect_uri specified in the authorization link, along with the authorization code (code) and shop ID (shop_id):
https://open.shopee.com/?code=xxxxxxxxxx&shop_id=xxxxxx (https://open.shopee.com/?code=xxxxxxxxxx&shop_id=xxxxxx)
Authorizing from a main account 
1. To log in to a main account, the seller selects Switch to Sub Account on the login page.
 
2. The seller can then fill in their login details and select Log In.
 
3. The seller selects the shops that need to be authorized.
Note: For cross border sellers, If you need to call the merchant’s API, please remind the seller to select the Auth Merchant checkbox.
Local main account authorization: 
4. If the authorization checkbox is not selected, the system will display a reminder popup.
5. The seller selects Confirm Authorization to confirm their selection.
6. After authorization is completed, the frontend page will redirect to the redirect_uri specified in the authorization link, along with the authorization code (code) and main account ID (main_account_id):
https://open.shopee.com/?code=xxxxxx&main_account_id=xxxxxx (https://open.shopee.com/?code=xxxxxx&main_account_id=xxxxxx)
Getting and using the authorization code 
After the seller completes authorization, the frontend page will redirect to the redirect_uri specified in the authorization link, along with the authorization code (code) and shop_id / main_account_id. Taking main_account_id as an example:
https://open.shopee.com/?code=xxxxxx&main_account_id=xxxxxx (https://open.shopee.com/?code=xxxxxx&main_account_id=xxxxxx) 
 
You can use this authorization code (code) to obtain the initial access token (access_token).
 
Parameters Returned in the Redirect URL
Parameter nameTypeDescriptioncodestringReturned when the call is successful. This code is used to obtain access_token and refresh_token. It is valid for only once and expires after 10 minutes.shop_idintThe ID of the shop that just granted authorization to your App. Returned after authorization was done on a shop account. main_account_idintThe ID of the main account that just granted authorization to your shop. . Returned after authorization was done on a main account. 
Note: If the domain of the redirect_uri parameter (or the redirect parameter in legacy links) does not match the Redirect URL Domain declared in the Console when generating the authorization link, the following error will be returned:
“The domain of redirect_uri is not consistent with the Redirect URL Domain declared in console”
(The domain of the callback URL is inconsistent with the Redirect URL Domain declared in the Console.)
Getting and refreshing the access_token 
The access_token is a dynamic token required for calling non-public APIs. It is valid for 4 hours and can be used multiple times within its validity period.
 
Before the access_token expires, you need to use the refresh_token to call the Refresh Access Token API (RefreshAccessToken) to obtain a new access_token. The refresh_token is valid for 30 days.
 
⚠️ Note
- The access_token and refresh_token corresponding to each shop_id / merchant_id / user_id / supplier_id must be stored separately;
- After a new access_token is generated, the previous access_token will remain valid for another 5 minutes;
- Re-authorization will refresh both the refresh_token and access_token;
- The RefreshAccessToken API must be called within the authorization validity period;
- If the latest available refresh_token and access_token are lost, please refer to the relevant FAQ (https://open.shopee.com/faq?top=177&sub=180&page=1&faq=216).
GetAccesstoken 
After successful authorization, use the code and shop_id or main_account_id in the redirect URL to call this API. This helps you obtain the shop_id, merchant_id, access_token and refresh_token.
 
Request Information
PathDetailsProduction Environmenthttps://partner.shopeemobile.com/api/v2/auth/token/get (https://partner.shopeemobile.com/api/v2/auth/token/get)Sandbox Environmenthttps://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/token/get (https://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/token/get)Request MethodPOST 
Common parameters
Parameter nameTypeRequiredDescriptionsignstringTrueThe signature obtained by sign base string (order: partner_id, api path, timestamp...) HMAC-SHA256 hashing with the partner_key.partner_idintTrueThe partner_id obtained from the App. This partner_id is put into the query.timestampintTrueTimestamp, valid for 5 minutes. 
Request parameters:
Parameter nameTypeRequiredDescriptioncodestringTrueThe code in the redirect URL after authorization. It is only valid once and expires after 10 minutes.partner_idintTrueThe partner_id obtained from the App. This partner_id is put into the request body.shop_idint 
True, input 1 only.
For the shop_id authorized to you, either the shop_id or main_account_id can be selected as the input parameter.main_account_idintFor the main_account_id authorized to you, either the shop_id or main_account_id can be selected as the input parameter. 
Response parameters:
Parameter nameTypeDescriptionrequest_idstringID of API requests; always returned. Used to diagnose problems.errorstringError codes for API requests; always returned. 
When the API call is successful, the error code returned is empty.
refresh_tokenstringReturned when the API call is successful. 
Use refresh_token to get a new access_token. Valid for each shop_id and merchant_id respectively, for 30 days.
access_tokenstringReturned when the API call is successful. 
A dynamic token that can be used multiple times and expires after 4 hours.
expire_inintReturned when the API call is successful. 
The validity period of the access_token, in seconds.
messagestringAlways returned. Provides detailed error information.merchant_id_listint[ ]Returned when there is main_account_id in the input parameter, including all the merchant_ids authorized this time under the main account.shop_id_listint[ ]Returned when there is main_account_id in the input parameter, including all shop_ids authorized this time under the main account.supplier_id_listint[]Returned when auth_type=supplieruser_id_listint[]Returned when auth_type=user 
Calculating the sign parameter
 
The sign parameter is not only a component of the authorization link, but also a parameter used for authentication each time it is called. This section will explain how to create a sign base string and calculate the authentication signature through HMAC-SHA256.
 
Creating a sign base string
There are 3 types of APIs that require the use of different parameters to create the sign base string. (consistent with its common parameters).
 
Concatenate the API path (without host) and the common parameters below into a single sign base string in the following order:
 
- For Shop APIs: partner_id, api path, timestamp, access_token, shop_id
- For Merchant APIs: partner_id, api path, timestamp, access_token, merchant_id
- For Public APIs: partner_id, api path, timestamp
 
Calculating the authentication signature
Use HMAC-SHA256 to hash the sign base string, and use the partner key as the encryption key. The hexadecimal all-lowercase hash value is the authentication signature.
 
Python Code Demo:
import hmac
import json
import time
import requests
import hashlib

def shop_auth():
    timest = int(time.time())
    host = "https://partner.shopeemobile.com"
    path = "/api/v2/shop/auth_partner"
    redirect_url = "https://www.baidu.com/"
    partner_id = 80001
    tmp = "test...."
    partner_key = tmp.encode()
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    ##generate api
    url = host + path + "?partner_id=%s&timestamp=%s&sign=%s&redirect=%s" % (partner_id, timest, sign, redirect_url)
    print(url)
 
Go Code Demo:
func auth_shop(){
	timest := strconv.FormatInt(time.Now().Unix(),10)
	host := "https://openplatform.sandbox.test-stable.shopee.sg"
	path := "/api/v2/shop/auth_partner"
	redirectUrl := "https://www.baidu.com/"
	partnerId := strconv.Itoa(2006566)
	partnerKey := "1391fd986fe8ec7569bebed75b0c33ee35eb5a305bed7038657a5cd5f75b1c88"
	baseString := fmt.Sprintf("%s%s%s", partnerId,path,timest)
	h := hmac.New(sha256.New,[]byte(partnerKey))
	h.Write([]byte(baseString))
	sign := hex.EncodeToString(h.Sum(nil))
	url := fmt.Sprintf(host+path+"?partner_id=%s&timestamp=%s&sign=%s&redirect=%s", partnerId,timest,sign, redirectUrl)
	fmt.Println(url)
} 
Java Code Demo:
    //generate auth url
    public static void shop_auth(){
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/shop/auth_partner";
        String redirect_url = "https://www.baidu.com/";
        long partner_id = 123456L;
        String tmp_partner_key = "...";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        String sign = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = String.format("%064x",new BigInteger(1,mac.doFinal(base_string)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String url = host + path + String.format("?partner_id=%s&timestamp=%s&sign=%s&redirect=%s", partner_id,timest, sign, redirect_url);
        System.out.println(url);
    } 
PHP Code Demo:
<?php 

function authShop($partnerId, $partnerKey) {   
    global $host;
    $path = "/api/v2/shop/auth_partner";
    $redirectUrl = "https://www.baidu.com/";

    $timest = time();
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&timestamp=%s&sign=%s&redirect=%s", $host, $path, $partnerId, $timest, $sign, $redirectUrl);
    return $url;
}

$host="https://openplatform.sandbox.test-stable.shopee.sg";

$partnerId = 847892;
$partnerKey = "57615053704d6470644f554a78656d50484143644964436a5568777544524579";

echo authShop($partnerId, $partnerKey);
?> 
 
GetAccesstoken Demo
 
Python Code Demo:
print(shop_auth())
# first time request token
def get_token_shop_level(code, partner_id, tmp_partner_key, shop_id):
    timest = int(time.time())
    host = "https://partner.shopeemobile.com"
    path = "/api/v2/auth/token/get"
    body = {"code": code, "shop_id": shop_id, "partner_id": partner_id}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&timestamp=%s&sign=%s" % (partner_id, timest, sign)
    # print(url)
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token

def get_token_account_level(code, partner_id, tmp_partner_key, main_account_id):
    timest = int(time.time())
    host = "https://openplatform.sandbox.test-stable.shopee.sg"
    path = "/api/v2/auth/token/get"
    body = {"code": code, "main_account_id": main_account_id, "partner_id": partner_id}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&timestamp=%s&sign=%s" % (partner_id, timest, sign)

    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token 
Java Code Demo:
import com.alibaba.fastjson.JSONObject;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.HashMap;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import com.alibaba.fastjson.JSON;

public class shop_auth {
    public static void main(String[] args) throws ParseException, IOException {
        shop_auth();
        //get_token_shop_level(code,partner_id,partner_key,shop_id);
    }
    //generate auth url
    public static void shop_auth(){
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/shop/auth_partner";
        String redirect_url = "https://www.baidu.com/";
        long partner_id = 123456L;
        String tmp_partner_key = "...";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        String sign = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = String.format("%064x",new BigInteger(1,mac.doFinal(base_string)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String url = host + path + String.format("?partner_id=%s&timestamp=%s&sign=%s&redirect=%s", partner_id,timest, sign, redirect_url);
        System.out.println(url);
    }

    //shop request for access token for the first time
    public static String[] get_token_shop_level(String code,long partner_id,String tmp_partner_key,long shop_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/auth/token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&timestamp=%s&sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map<String,Object> map = new HashMap<>();
            map.put("code",code);
            map.put("shop_id",shop_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    }

    //main account request for the access token for the first time
    public static String[] get_token_account_level(String code,long partner_id,String tmp_partner_key,long main_account_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://openplatform.sandbox.test-stable.shopee.sg";
        String path = "/api/v2/auth/token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&timestamp=%s&sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map<String,Object> map = new HashMap<>();
            map.put("code",code);
            map.put("main_account_id",main_account_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    } 
PHP Code Demo:
<?php 

function getTokenShopLevel($code, $partnerId, $partnerKey, $shopId) {
    global $host;
    $path = "/api/v2/auth/token/get";
    
    $timest = time();
    $body = array("code" => $code,  "shop_id" => $shopId, "partner_id" => $partnerId);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&timestamp=%s&sign=%s", $host, $path, $partnerId, $timest, $sign);
    

    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $resp = curl_exec($c);
    echo "raw result: $resp";

    $ret = json_decode($resp, true);
    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: $accessToken, refresh_token: $newRefreshToken raw: $ret"."\n";
    return $ret;
}

function getTokenAccountLevel($code, $partnerId, $partnerKey, $mainAccountId) {
    global $host;
    $path = "/api/v2/auth/token/get";
    
    $timest = time();
    $body = array("code" => $code,  "main_account_id" => $mainAccountId, "partner_id" => $partnerId);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);

    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&timestamp=%s&sign=%s", $host, $path, $partnerId, $timest, $sign);

    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($c);
    echo "\nraw result ".$result."\n";

    $ret = json_decode($result, true);
    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: ".$accessToken.", refresh_token: ".$newRefreshToken."\n";
    return $ret;
}

$host="https://partner.shopeemobile.com";

$partnerId = 847892;
$partnerKey = "57615053704d6470644f554a78656d50484143644964436a5568777544524579";

$code="494d7a4a4f5a66524556776f66425453";

// $shopId=200520705;
// getTokenShopLevel($code, $partnerId, $partnerKey, $shopId);

$accountId=19479;
getTokenAccountLevel($code, $partnerId, $partnerKey, $accountId)

?>RefreshAccessToken 
Before the access_token expires, use the refresh_token to call this API to obtain a new access_token and refresh_token. The new refresh_token must be used for the next refresh request.
 
Request Information
PathDetailsProduction Environmenthttps://partner.shopeemobile.com/api/v2/auth/access_token/get (https://partner.shopeemobile.com/api/v2/auth/access_token/get)Sandbox Environmenthttps://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/access_token/get (https://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/access_token/get)Request MethodPOST⚠️ Note
 
For the same main_account_id, the initial access_token and refresh_token obtained from GetAccessToken are identical. After calling the RefreshAccessToken API separately for each shop_id and merchant_id, each shop_id and merchant_id will generate its own independent new access_token and refresh_token.
 
For example:
1. The initial access_token / refresh_token obtained from GetAccessToken is assigned to 7 shop_ids and 3 merchant_ids.
2. After the initial access_token expires, you use the initial refresh_token to call RefreshAccessToken,and obtain 10 independent sets of access_token and refresh_token for each shop_id and merchant_id.
3. After this, shop_id and merchant_id will no longer share any access_token or refresh_token.
 
Public parameters:
 
Consistent with the common parameters of the GetAccessToken API.
Parameter nameTypeRequiredDescriptionsignstringTrueThe signature obtained by sign base string (order: partner_id, api path, timestamp...) HMAC-SHA256 hashing with the partner_key.partner_idintTrueThe partner_id obtained from the APP. This partner_id is put into the query.timestampintTrueTimestamp, valid for 5 minutes. 
Request parameters:
Parameter nameTypeRequiredDescriptionrefresh_tokenstringTrueUse refresh_token to get a new access_token. Each refresh_token is valid for 30 days, and can only be used once by either a shop_id or merchant_id.partner_idintTrueThe partner_id obtained from the App. This partner_id is inserted into the body.shop_idint 
 
Yes, input 1 only. 
The shop_id of the main account that granted authorization to your App. Only the shop_id or merchant_id can be selected as the input parameter, and they must be refreshed separately.

 
merchant_idintThe merchant_id for identifying the main account that granted authorization to your App. Only the shop_id or merchant_id can be selected as the input parameter, and they must be refreshed separately.

 
 
Response parameters:
Parameter nameTypeDescriptionrequest_idstringID of API requests; always returned. 
Used to diagnose problems. 

 
errorstringError codes for API requests; always returned. 
When the API call is successful, the error code returned is empty.
refresh_tokenstringNew refresh_token
Returned when the API call is successful. 
Use a refresh_token to get a new access_token. 
Each refresh_token is valid for 30 days, and can only be used once by either a shop_id or merchant_id.
access_tokenstringReturned when the API call is successful. 
Each new access_token is a dynamic token that can be used multiple times. It expires after 4 hours.
expire_inintReturned when the API call is successful. 
The validity period of the access_token, in seconds.
messagestringAlways returned. Provides detailed error information.merchant_idintReturned when the API call is successful. 
The merchant_id for this refresh, for identifying each merchant.
shop_idintReturned when the API call is successful. 
The shop_id for this refresh
partner_idintReturned when the API call is successful. 
The partner_id you used for this refresh
supplier_id_listint[]Return when auth_type=supplieruser_id_listint[]Return when auth_type=user 
RefreshAccessToken Demo
 
Python Code Demo:
# refresh token

def get_access_token_shop_level(shop_id, partner_id, tmp_partner_key, refresh_token):
    timest = int(time.time())
    host = "https://openplatform.sandbox.test-stable.shopee.sg"
    path = "/api/v2/auth/access_token/get"
    body = {"shop_id": shop_id, "refresh_token": refresh_token,"partner_id":partner_id}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&timestamp=%s&sign=%s" % (partner_id, timest, sign)
    # print(url)
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token

def get_access_token_merchant_level(merchant_id, partner_id, tmp_partner_key, refresh_token):
    timest = int(time.time())
    host = "https://openplatform.sandbox.test-stable.shopee.sg"
    path = "/api/v2/auth/access_token/get"
    body = {"merchant_id": merchant_id, "refresh_token": refresh_token}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&timestamp=%s&sign=%s" % (partner_id, timest, sign)

    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token

partner_id = 2006566
partner_key = "1a78dde5d6c3342f56ac939cbdd81607654c0e87725e118736ba5e3ae31c579c"
shop_id = 602226924
main_account_id = 31219
merchant_id = 45719
code = "c01204cada7b4cd0e4688154f5a256ca"
print(shop_auth())
# access_token,refresh_token = get_token_shop_level(code,partner_id,partner_key,602226924)
# print(access_token)
# print(refresh_token)
# print(get_access_token_shop_level(shop_id,partner_id,partner_key,refresh_token))

access_token,refresh_token = get_token_account_level(code,partner_id,partner_key,main_account_id)
print(access_token)
print(refresh_token)
print(get_access_token_merchant_level(merchant_id,partner_id,partner_key,refresh_token))
    
Java Code Demo:

    //shop refresh the access token
    public static String[] get_access_token_shop_level(String refresh_token,long partner_id,String tmp_partner_key,long shop_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/auth/access_token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&timestamp=%s&sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map<String,Object> map = new HashMap<>();
            map.put("refresh_token",refresh_token);
            map.put("shop_id",shop_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    }

    //merchant refresh the access token
    public static String[] get_access_token_merchant_level(String refresh_token,long partner_id,String tmp_partner_key,long merchant_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/auth/access_token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&timestamp=%s&sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map<String,Object> map = new HashMap<>();
            map.put("refresh_token",refresh_token);
            map.put("merchant_id",merchant_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    }
} 
PHP Code Demo:
<?php 

function getAccessTokenShopLevel($partnerId, $partnerKey, $shopId, $refreshToken) {
    global $host;
    $path = "/api/v2/auth/access_token/get";
    
    $timest = time();
    $body = array("partner_id" => $partnerId, "shop_id" => $shopId, "refresh_token" => $refreshToken);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&timestamp=%s&sign=%s", $host, $path, $partnerId, $timest, $sign);

    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($c);
    echo "\nraw result ".$result."\n";

    $ret = json_decode($result, true);

    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: ".$accessToken.", refresh_token: ".$newRefreshToken."\n";
    return $ret;
}

function getAccessTokenMerchantLevel($partnerId, $partnerKey, $merchantId, $refreshToken) {
    global $host;
    $path = "/api/v2/auth/access_token/get";
    
    $timest = time();
    $body = array("partner_id" => $partnerId, "merchant_id" => $merchantId, "refresh_token" => $refreshToken);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&timestamp=%s&sign=%s", $host, $path, $partnerId, $timest, $sign);

    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($c);
    echo "\nraw result ".$result."\n";

    $ret = json_decode($result, true);
    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: ".$accessToken.", refresh_token: ".$newRefreshToken."\n";
    return $ret;
}

$host="https://partner.shopeemobile.com";

$partnerId = 847892;
$partnerKey = "57615053704d6470644f554a78656d50484143644964436a5568777544524579";

// $shopId=200520705;
// $shopRefreshToken="71724c4e68746b546965424c70617244";
// getAccessTokenShopLevel($partnerId, $partnerKey, $shopId, $shopRefreshToken)

$merchantId=1018829;
$merchantRefreshToken="546e5064627042696756455277774f53";
getAccessTokenMerchantLevel($partnerId, $partnerKey, $merchantId, $merchantRefreshToken)

?>Refreshing the access_token and refresh_token on a shop account 
1. Use the code and shop_id from the redirect URLhttps://open.shopee.com/?code=7867624d4e76616648544f6e52625557&shop_id=54804 (https://open.shopee.com/?code=7867624d4e76616648544f6e52625557&shop_id=54804) to call the GetAccessToken API to obtain the first pair of access_token and refresh_token.
 
Query: https://partner.shopeemobile.com/api/v2/auth/token/get?partner_id=1000016&timestamp=1657263479&sign=9c685bc7e4a74e90f45fe1933f1d72b2d9705acda4093a9fb1ec7e2b57ccea2a
 
{"shop_id":54804,
"code":"7867624d4e76616648544f6e52625557",
"partner_id":1000016
}
 
2.Save the first pair of access_token and refresh_token returned.
{
   "refresh_token": "456e416149664b76745a6a794156794a",
   "access_token": "6a55746e61546f707579627656637464",
   "expire_in": 13859,
   "request_id": "c040b886cfcabdfa5a23af51c595cd1b",
   "error": "",
   "message": ""
}
 
3.Call the RefreshAccessToken API to refresh the access_token and refresh_token.
Query: https://partner.shopeemobile.com/api/v2/auth/access_token/get?partner_id=1000016&timestamp=1657263479&sign=9c685bc7e4a74e90f45fe1933f1d72b2d9705acda4093a9fb1ec7e2b57ccea2a
 
{"shop_id":54804,
"refresh_token":"456e416149664b76745a6a794156794a",
"partner_id":1000016
}
 
4.Save the new access_token and refresh_token.
{
   "partner_id": 1000016,
   "refresh_token": "666478546b6c63464867685554477a57",
   "access_token": "7a5970754768697552654a466f425573",
   "expire_in": 14400,
   "request_id": "6d79dd0ffe4e070e185c71ca5153cd51",
   "error": "",
   "message": "",
   "shop_id": 54804
}
Refreshing the access_token and refresh_token on a main account 
1.Use the code and main_account_id from the URL obtained during authorization to call the GetAccessToken API and obtain the first pair of access_token and refresh_token.
Redirect URL: : https://open.shopee.com/?code=644d4e48787873706c5a444c776d4b59&main_account_id=10208
 
Query: https://partner.shopeemobile.com/api/v2/auth/token/get?partner_id=1000016&timestamp=1657263479&sign=9c685bc7e4a74e90f45fe1933f1d72b2d9705acda4093a9fb1ec7e2b57ccea2a
{"main_account_id":10208,
"code":"644d4e48787873706c5a444c776d4b59",
"partner_id":1000016
}
 
2.Save the first pair of access_token and refresh_token returned.
 
{
   "refresh_token": "684d42685667777868597a4477587455",
   "access_token": "44776151594778486943647644745361",
   "expire_in": 14344,
   "request_id": "9199e13ee74b22411498209cb5516e24",
   "merchant_id_list": [
       1001705
   ],
   "shop_id_list": [
       33142,
       46154
   ],
   "error": "",
   "message": ""
}
 
3.Call the RefreshAccessToken API to refresh the access_token and refresh_token of shop_id and merchant_id respectively
 
Query: https://partner.shopeemobile.com/api/v2/auth/access_token/get?partner_id=1000016&timestamp=1657868745&sign=b78833ddcf533903cfae818bbfcf2b6b630e3bc0c941dd65453632f63bf7b495
{"shop_id":33142,
"refresh_token":"684d42685667777868597a4477587455",
"partner_id":1000016
}
Query: https://partner.shopeemobile.com/api/v2/auth/access_token/get?partner_id=1000016&timestamp=1657868745&sign=b78833ddcf533903cfae818bbfcf2b6b630e3bc0c941dd65453632f63bf7b495
{"merchant_id":1001705,
"refresh_token":"684d42685667777868597a4477587455",
"partner_id":1000016
}
 
4.Save the new access_token and refresh_token.
 
{
   "partner_id": 1000016,
   "refresh_token": "417472546e73504949676279576c477a",
   "access_token": "646d474965714a696177764963775743",
   "expire_in": 14400,
   "request_id": "78e64d11cb6dec6f6669282839fca916",
   "error": "",
   "message": "",
   "shop_id": 33142
}
{
   "partner_id": 1000016,
   "refresh_token": "715075736d6c6570544364774f437369",
   "access_token": "69634c664a7350696c6b466d5a53714a",
   "expire_in": 14400,
   "request_id": "51eacbc81bd6fa8fddddf1e0ef2dee16",
   "error": "",
   "message": "",
   "merchant_id": 1001705
}
 
By following the steps above, you can call the RefreshAccessToken API  within 4 hours to get new access_token and refresh_token. Maintaining the API call loop will ensure you can continue to obtain new sets of access_token and refresh_token within the authorization validity period. 
⚠️ Note
If you did not save the new refresh_token and access_token returned, see possible solutions (https://open.shopee.com/faq?top=177&sub=180&page=1&faq=216).
Canceling authorization 
You can cancel an authorization by changing the authorization URL or via Seller Center.
Canceling authorization by changing the authorization URL 
Authorization can be revoked either by generating a cancellation authorization link or by performing the operation in Seller Center.
 
Revoking authorization via cancellation link
 
The method for generating a cancellation authorization link is the same as that for the authorization link, except that the fixed authorization URL should be replaced with the fixed cancellation authorization URL.
 
Fixed Cancellation Authorization URL
EnvironmentRegionURLProductionGlobal (excluding Mainland China and Brazil)https://open.shopee.com/cancel_auth (https://open.shopee.com/cancel_auth)Mainland Chinahttps://open.shopee.cn/cancel_auth (https://open.shopee.cn/cancel_auth)Brazilhttps://open.shopee.com.br/cancel_auth (https://open.shopee.com.br/cancel_auth)SandboxGlobal (excluding Mainland China and Brazil)https://open. (https://open.test-stable.shopee.com/cancel_auth)sandbox.test-stable. (https://open.test-stable.shopee.com/auth)shopee.com/cancel_auth (https://open.test-stable.shopee.com/cancel_auth)Mainland Chinahttps://open. (https://open.test-stable.shopee.cn/cancel_auth)sandbox.test-stable. (https://open.test-stable.shopee.com/auth)shopee.cn/cancel_auth (https://open.test-stable.shopee.cn/cancel_auth)Brazilhttps://open. (https://open.test-stable.shopee.com.br/cancel_auth)sandbox.test-stable. (https://open.test-stable.shopee.com/auth)shopee.com.br/cancel_auth (https://open.test-stable.shopee.com.br/cancel_auth) 
Cancellation Authorization Link Examples
 
Production Environment:
https://open.shopee.com/cancel_auth?partner_id=10090&auth_type=seller&redirect_uri=https://open.shopee.com&response_type=code (https://open.shopee.com/cancel_auth?partner_id=10090&auth_type=seller&redirect_uri=https://open.shopee.com&response_type=code)   
 
Sandbox Environment:
https://open.test-stable.shopee.com/cancel_auth?partner_id=1000016&auth_type=seller&redirect_uri=https://open.test-stable.shopee.com&response_type=code (https://open.test-stable.shopee.com/cancel_auth?partner_id=1000016&auth_type=seller&redirect_uri=https://open.test-stable.shopee.com&response_type=code)  
 
Cancellation Process
 
1. Generate the cancellation authorization link according to the specifications above;
2. The seller logs in via the cancellation authorization link;
3. The seller clicks “Cancel Authorization” to complete the process. After cancellation, the application will no longer have access to the seller’s information.
Canceling authorization on Seller Center  
Local Sellers:
- The seller logs in to Seller Center and navigates to “Home Page > Platform Partner”;
- On the Platform Partner page, the seller can view all apps authorized by the shop / main account, along with their authorization expiration time;
- The seller clicks “Separate” in the action column to revoke authorization for the corresponding application.
 
CNSC/KRSC Sellers
“Home Page > Open Platform Management”: Sellers can view which apps have been authorized by the main account. In the authorization management page, sellers can directly revoke the authorization relationship for the merchant or shop.
FAQs on authorization and authentication 
If you encounter errors during the authorization process, you can refer to our FAQs on authorization and authentication. (https://open.shopee.com/faq?top=177&sub=180&page=1&faq=215)

## Content (raw HTML)

```html
<p>&nbsp;</p><p>Authorization is an important step to using Open API. You need to be authorized by the seller in order for your App to call non-public APIs required for shop management.</p><p>&nbsp;</p><p>You will be authenticated based on the public parameters passed to Open API. If the authentication fails, your call will fail and an error will be returned.</p><figure class="table"><table><tbody><tr><td><p>⚠️<strong> Note&nbsp;</strong></p><ul><li><strong>Authorization Validity</strong></li></ul><p class="indent-1">The maximum validity period for each authorization is 365 days. Sellers may customize the authorization expiration time during the authorization process. Once the authorization expires, you will need to contact the seller to re-authorize your App.</p><p class="indent-1">&nbsp;</p><ul><li><strong>SIP Shops Authorization</strong></li></ul><p class="indent-1">If a CB SIP primary shop grants authorization to an application, all SIP linked shops will automatically receive the same authorization. However, API access permissions for linked shops are limited. For more details, please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=166&amp;page=1&amp;faq=214"><u>FAQ</u></a><u> </u>.</p></td></tr></tbody></table></figure><h1><span style="color:#2B2C2D;">The authorization process</span></h1><p>&nbsp;</p><p>There are 3 steps to complete authorization: <strong>generating the authorization link, acquiring authorization from shop(s), </strong>and<strong> getting and refreshing the access_token</strong>.</p><p>&nbsp;</p><p>These will be explained in detail below, along with information on what to prepare before authorization, details of the authorization process, and how to use the information returned after authorization to pass the authentication of the platform.</p><h2><span style="color:#2B2C2D;">Generating the authorization link</span></h2><p>&nbsp;</p><p><span style="color:rgb(43,44,45);">To improve integration efficiency, the platform provides a new method for generating authorization links. The authorization link is composed of a fixed authorization URL and authorization parameters. All types of Apps can generate authorization links according to the specifications below.</span></p><p>&nbsp;</p><p><span style="color:rgb(43,44,45);">Note:&nbsp;</span></p><ul><li><span style="color:rgb(43,44,45);">For Seller in House System Apps, you can log in to the Open Platform &gt; App list &gt; click “Authorize” &gt; fill in Redirect URL to generate an authorization link.</span></li><li>For all other type of App: there is no "Authorize" display, you need to create an authorization link with the following specifications. The authorization link comprises a <strong>fixed authorization URL</strong> and <strong>other required parameters</strong>.</li></ul><p>&nbsp;</p><p><span style="color:rgb(43,44,45);"><i>(Seller in House System Apps)</i></span></p><figure class="image image_resized" style="width:691px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=AwcI9KDq2kAasxHvc5J41P2%2FdxfAcI3okQeHbiqAUNk94RGGSxJB0feXlyNMS8S9YERegWzV4ki4AMlGULhn3Q%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p><i>(Other Apps)</i></p><figure class="image image_resized" style="width:515px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=Ynopot8tZpO%2FdzHzAZtFq0nt8kBFSTNf2QkXO1xbDvS01NCMohhc2tN7ftOLrUUIR1p4MLIe2CTzo9vdNwP8fQ%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>&nbsp;</p><p><strong>Fixed authorization URL:</strong></p><figure class="table"><table><thead><tr><th><strong>Environment</strong></th><th><strong>Region</strong></th><th><strong>URL</strong></th></tr></thead><tbody><tr><td rowspan="3">Production</td><td>Global (excluding Mainland China and Brazil)</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/auth">https://open.shopee.com/auth</a></td></tr><tr><td>Mainland China</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.cn/auth">https://open.shopee.cn/auth</a></td></tr><tr><td>Brazil</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com.br/auth">https://open.shopee.com.br/auth</a></td></tr><tr><td rowspan="3">Sandbox</td><td>Global (excluding Mainland China and Brazil)</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/auth">https://open.sandbox.test-stable.shopee.com/auth</a></td></tr><tr><td>Mainland China</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/auth">https://open.sandbox.test-stable.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.cn/auth">shopee.cn/auth</a></td></tr><tr><td>Brazil</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/auth">https://open.sandbox.test-stable.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com.br/auth">shopee.com.br/auth</a></td></tr></tbody></table></figure><p>&nbsp;</p><p>Other required parameters:</p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Required</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>partner_id</td><td>int</td><td>Yes</td><td>partner_id obtained from the App.</td></tr><tr><td>auth_type</td><td>string</td><td>Yes</td><td><p>The role type to be authorized. Enum values:</p><p>- seller: used when authorizing a shop or merchant;</p><p>- supplier: used when authorizing suppliers (for SCS users);</p><p>- user: used when authorizing users (for livestream-related apps, see</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/announcements/1190"><u>https://open.shopee.com/announcements/1190</u></a> 。</p></td></tr><tr><td>redirect_uri</td><td>string</td><td>Yes</td><td><p>The URL where the authorization code (code) is received after the seller completes authorization.</p><p>&nbsp;</p><p>Production environment: If the production callback URL domain of the app is empty, the redirect_uri domain is not validated; otherwise, it must match the configured production callback URL domain.</p><p>&nbsp;</p><p>Sandbox environment: If the sandbox callback URL domain is empty, the redirect_uri domain is not validated; otherwise, it must match the configured sandbox callback URL domain.</p></td></tr><tr><td>response_type</td><td>string</td><td>Yes</td><td>The authorization type. Fixed value: "code".</td></tr><tr><td>state</td><td>string</td><td>No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>A random, unguessable string used to prevent CSRF attacks. It will be returned as-is to the redirect_uri after authorization is completed.</td></tr></tbody></table></figure><h3><strong>Redirect URL Domain Validation Requirements</strong></h3><p>&nbsp;</p><p>To ensure seller data security, the platform has introduced domain validation for the callback address (redirect_uri) in authorization links. All developers are required to configure the Test Redirect URL Domain and Live Redirect URL Domain for each App in the Console.</p><p>&nbsp;</p><p>The redirect_uri parameter mentioned above refers to the callback URL configured in the App information page. You can view it as follows:</p><figure class="image image_resized" style="width:602px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=LWlPMk1MPvBKjXYViUTE2s2D%2BtKyBcgoIp81rFFMYbAcfXxCNla2k9%2FUShW3XzK1YaFBklT1Sj9w%2BlQspVK%2FzA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>&nbsp;</p><h3><strong>Notes on Redirect URL Domain Validation</strong></h3><p>&nbsp;</p><p>1. For Apps that have already been created but have not yet declared a callback URL domain, developers should log in to the Console and complete the configuration in the App edit page as soon as possible. Before the configuration is completed, the platform will not enforce domain validation, and the existing authorization process will not be affected.</p><p>2. If the domain of the redirect_uri parameter (or the redirect parameter in legacy links) does not match the Redirect URL Domain configured in the Console when generating an authorization link, the platform will return the following error:</p><p><span style="color:#EE4D2D;">"The domain of redirect_uri is not consistent with the Redirect URL Domain declared in console"</span><br>(The domain of the callback URL does not match the Redirect URL Domain declared in the Console.)</p><p>&nbsp;</p><h3>&nbsp;<strong>Authorization Link Examples</strong></h3><p>&nbsp;</p><p>The following are examples of authorization links for both the Production and Sandbox environments for your reference.</p><p>&nbsp;</p><p><strong>Production Environment:</strong></p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/auth?partner_id=10090&amp;auth_type=seller&amp;redirect_uri=https://open.shopee.com&amp;response_type=code"><span style="background-color:rgb(255,255,255);color:rgb(51,51,51);">https://open.shopee.com/auth?partner_id=10090&amp;auth_type=seller&amp;redirect_uri=https://open.shopee.com&amp;response_type=code</span></a><span style="background-color:rgb(255,255,255);color:rgb(51,51,51);">&nbsp;</span></p><p>&nbsp;</p><p><strong>Sandbox Environment:</strong></p><p>https://open.test-stable.shopee.com/auth?partner_id=1000016&amp;auth_type=seller&amp;redirect_uri=https://open.test-stable.shopee.com&amp;response_type=code</p><figure class="table"><table><tbody><tr><td><p>⚠️<strong> Note</strong></p><p>The timestamp used to calculate the sign is only valid for 5 minutes. After the timestamp and the sign expire, the authorization link will no longer be valid, and you need to generate a new link.</p></td></tr></tbody></table></figure><h2><span style="color:#2B2C2D;">Acquiring authorizations from shop(s)</span></h2><p>&nbsp;</p><p>After you share the authorization link with the seller, the seller needs to log in to their account, fill in the verification code sent to their mobile phone, and enter the authorization page.</p><p>&nbsp;</p><p>Account types:</p><ul><li>Shop account: can authorize a single shop;</li><li>Main account: can authorize multiple merchants / shops;</li><li>Sub-account: cannot log in to the authorization page.</li></ul><h3><span style="color:#2B2C2D;"><strong>Authorizing from a shop account&nbsp;</strong></span></h3><p>&nbsp;</p><p>1. The seller fills in their login details and selects <strong>Log In</strong>.</p><figure class="image image_resized" style="width:811px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=KBASnrCAFko2mX9S0T89U%2FSoT4CJMyAjC1M1ZSkJQ1ZNGsMzm0ze%2F7IWwW0sm2fwR4Oe0IYvVEzUYBwXbEwctA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">2. The seller fills in the verification code sent to their mobile phone and selects <strong>Verify</strong>.</span></p><figure class="image image_resized" style="width:740px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=UCU7KvaUzAaB2HKVcZFMWNv%2F%2BQ5uquLHwmjRaybfr8fXkrjrGmyT37Nf4MbtS7bbV2Ac5hCEZLXfPrlPFBAf2Q%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>3. Upon logging in, the seller selects <strong>Confirm Authorization</strong>.</p><figure class="image image_resized" style="width:944px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=m%2FSS%2FEpwlZ3gfVkoRF1djvREdKCwVR9jmnlr%2F27y6Di2GBlc4SLS6to8TZpplR%2BcgzYukxpFREyhox1zH5ZdvA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>4. The system will display an authorization validity period selector. Sellers can choose from preset durations (7 days, 30 days, 90 days, 180 days, or 365 days), or select “Customize Expiration Time” to set any expiration date within 365 days.</p><p>&nbsp;</p><p>5. After authorization is completed, the frontend page will redirect to the redirect_uri specified in the authorization link, along with the authorization code (code) and shop ID (shop_id):</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/?code=xxxxxxxxxx&amp;shop_id=xxxxxx"><u>https://open.shopee.com/?code=xxxxxxxxxx&amp;shop_id=xxxxxx</u></a></p><h3><span style="color:#2B2C2D;"><strong>Authorizing from a main account</strong></span></h3><p>&nbsp;</p><p>1. To log in to a main account, the seller selects <strong>Switch to Sub Account</strong> on the login page.</p><figure class="image image_resized" style="width:759px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=LYatUvT%2Fl8dbnhsm%2BMmkTQmzN%2F5EtrHRXU1xvTFwDYiY9j4Nbvs6%2FZas7rxt5tOp57UEYs3r%2BCU2uYIDPd90sA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>2. The seller can then fill in their login details and select <strong>Log In</strong>.</p><figure class="image image_resized" style="width:841px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=54kRFFgx%2FwQKfDOSLWx%2FxA%2FS8gkeyp2%2FxZ%2BYlQdiBeaSNwpe%2BhFefIE0jzeh%2Fh1a15BGXOB7v%2BliFgZVKPA5%2BA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>3. The seller selects the shops that need to be authorized.</p><p>Note: For cross border sellers, If you need to call the merchant’s API, please remind the seller to select the <strong>Auth Merchant</strong> checkbox.</p><figure class="image image_resized" style="width:912px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=clJ%2FGp14b1rbcJubC%2FO9DPSOfrTNvHIdy9PaV%2FdiRYEjg3LGHYATF5k%2BgKl9ljsVyCrHhnnJa69TKjIRDUXKNA%3D%3D&amp;image_type=png"></figure><p>Local main account authorization:&nbsp;</p><figure class="image image_resized" style="width:941px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=sU6aM4h8CpO5ULk%2FFPPkwoDldBRTslGuYAAjPFyeVOHjeyHsPcpV8JFjLqg0FGlBSvF%2FyYG2KECYJfphOUxDcw%3D%3D&amp;image_type=png"></figure><p>4. If the authorization checkbox is not selected, the system will display a reminder popup.</p><figure class="image image_resized" style="width:602px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=hRpJhHXiwikqpAMYcOvRUZ5bgWxgkN7%2FShw8OcnqxLoIMCMqQn16GEiE0%2FtSAJx0bCvrGgTP8fD%2BLL%2BW6c1HXA%3D%3D&amp;image_type=png"></figure><p>5. The seller selects <strong>Confirm Authorization</strong> to confirm their selection.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=M1jgkj8787sKyfBsBvnvHTQ26QPOPmse%2FMAGZSnZNGsFmvCvHYC0HajOw9bEIPJu7pHgo2dyrwFJqhrP1%2BWMXQ%3D%3D&amp;image_type=png"></figure><p>6. After authorization is completed, the frontend page will redirect to the redirect_uri specified in the authorization link, along with the authorization code (code) and main account ID (main_account_id):</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/?code=xxxxxx&amp;main_account_id=xxxxxx"><u>https://open.shopee.com/?code=xxxxxx&amp;main_account_id=xxxxxx</u></a></p><h2><span style="color:rgb(43,44,45);"><strong>Getting and u</strong></span><span style="color:#2B2C2D;">sing the authorization code</span></h2><p>&nbsp;</p><p>After the seller completes authorization, the frontend page will redirect to the redirect_uri specified in the authorization link, along with the authorization code (code) and shop_id / main_account_id. Taking main_account_id as an example:</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/?code=xxxxxx&amp;main_account_id=xxxxxx">https://open.shopee.com/?code=xxxxxx&amp;main_account_id=xxxxxx</a>&nbsp;</p><p>&nbsp;</p><p>You can use this authorization code (code) to obtain the initial access token (access_token).</p><p>&nbsp;</p><p><strong>Parameters Returned in the Redirect URL</strong></p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>code</td><td>string</td><td>Returned when the call is successful. This code is used to obtain access_token and refresh_token. It is valid for only once and expires after 10 minutes.</td></tr><tr><td>shop_id</td><td>int</td><td>The ID of the shop that just granted authorization to your App. Returned after authorization was done on a shop account.&nbsp;</td></tr><tr><td>main_account_id</td><td>int</td><td>The ID of the main account that just granted authorization to your shop. . Returned after authorization was done on a main account.</td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>Note: </strong>If the domain of the redirect_uri parameter (or the redirect parameter in legacy links) does not match the Redirect URL Domain declared in the Console when generating the authorization link, the following error will be returned:</p><p><span style="color:#EE4D2D;">“The domain of redirect_uri is not consistent with the Redirect URL Domain declared in console”</span><br>(The domain of the callback URL is inconsistent with the Redirect URL Domain declared in the Console.)</p><h2><span style="color:#2B2C2D;">Getting and refreshing the access_token</span></h2><p>&nbsp;</p><p>The access_token is a dynamic token required for calling non-public APIs. It is valid for 4 hours and can be used multiple times within its validity period.</p><p>&nbsp;</p><p>Before the access_token expires, you need to use the refresh_token to call the Refresh Access Token API (RefreshAccessToken) to obtain a new access_token. The refresh_token is valid for 30 days.</p><p>&nbsp;</p><p>⚠️<strong> Note</strong></p><ul><li>The access_token and refresh_token corresponding to each shop_id / merchant_id / user_id / supplier_id must be stored separately;</li><li>After a new access_token is generated, the previous access_token will remain valid for another 5 minutes;</li><li>Re-authorization will refresh both the refresh_token and access_token;</li><li>The RefreshAccessToken API must be called within the authorization validity period;</li><li>If the latest available refresh_token and access_token are lost, please refer to the relevant <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=177&amp;sub=180&amp;page=1&amp;faq=216"><u>FAQ</u></a>.</li></ul><h3><span style="color:#2B2C2D;"><strong>GetAccesstoken</strong></span></h3><p>&nbsp;</p><p>After successful authorization, use the code and shop_id or main_account_id in the redirect URL to call this API. This helps you obtain the shop_id, merchant_id, access_token and refresh_token.</p><p>&nbsp;</p><p><strong>Request Information</strong></p><figure class="table"><table><thead><tr><th><strong>Path</strong></th><th><strong>Details</strong></th></tr></thead><tbody><tr><td>Production Environment</td><td><a target="_blank" rel="noopener noreferrer" href="https://partner.shopeemobile.com/api/v2/auth/token/get"><u>https://partner.shopeemobile.com/api/v2/auth/token/get</u></a></td></tr><tr><td>Sandbox Environment</td><td><a target="_blank" rel="noopener noreferrer" href="https://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/token/get"><u>https://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/token/get</u></a></td></tr><tr><td>Request Method</td><td>POST</td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>Common parameters</strong></p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Required</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>sign</td><td>string</td><td>True</td><td>The signature obtained by sign base string (order: partner_id, api path, timestamp...) HMAC-SHA256 hashing with the partner_key.</td></tr><tr><td>partner_id</td><td>int</td><td>True</td><td>The partner_id obtained from the App. This partner_id is put into the query.</td></tr><tr><td>timestamp</td><td>int</td><td>True</td><td>Timestamp, valid for 5 minutes.</td></tr></tbody></table></figure><p>&nbsp;</p><p>Request parameters:</p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Required</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>code</td><td>string</td><td>True</td><td>The code in the redirect URL after authorization. It is only valid once and expires after 10 minutes.</td></tr><tr><td>partner_id</td><td>int</td><td>True</td><td>The partner_id obtained from the App. This partner_id is put into the request body.</td></tr><tr><td>shop_id</td><td>int</td><td rowspan="2"><p>&nbsp;</p><p>True, input 1 only.</p></td><td>For the shop_id authorized to you, either the shop_id or main_account_id can be selected as the input parameter.</td></tr><tr><td>main_account_id</td><td>int</td><td>For the main_account_id authorized to you, either the shop_id or main_account_id can be selected as the input parameter.</td></tr></tbody></table></figure><p>&nbsp;</p><p>Response parameters:</p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>request_id</td><td>string</td><td>ID of API requests; always returned. Used to diagnose problems.</td></tr><tr><td>error</td><td>string</td><td><p>Error codes for API requests; always returned.&nbsp;</p><p>When the API call is successful, the error code returned is empty.</p></td></tr><tr><td>refresh_token</td><td>string</td><td><p>Returned when the API call is successful.&nbsp;</p><p>Use refresh_token to get a new access_token. Valid for each shop_id and merchant_id respectively, for 30 days.</p></td></tr><tr><td>access_token</td><td>string</td><td><p>Returned when the API call is successful.&nbsp;</p><p>A dynamic token that can be used multiple times and expires after 4 hours.</p></td></tr><tr><td>expire_in</td><td>int</td><td><p>Returned when the API call is successful.&nbsp;</p><p>The validity period of the access_token, in seconds.</p></td></tr><tr><td>message</td><td>string</td><td>Always returned. Provides detailed error information.</td></tr><tr><td>merchant_id_list</td><td>int[ ]</td><td>Returned when there is main_account_id in the input parameter, including all the merchant_ids authorized this time under the main account.</td></tr><tr><td>shop_id_list</td><td>int[ ]</td><td>Returned when there is main_account_id in the input parameter, including all shop_ids authorized this time under the main account.</td></tr><tr><td>supplier_id_list</td><td>int[]</td><td>Returned when auth_type=supplier</td></tr><tr><td>user_id_list</td><td>int[]</td><td>Returned when auth_type=user</td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>Calculating the sign parameter</strong></p><p>&nbsp;</p><p>The sign parameter is not only a component of the authorization link, but also a parameter used for authentication each time it is called. This section will explain how to create a sign base string and calculate the authentication signature through HMAC-SHA256.</p><p>&nbsp;</p><p><strong>Creating a sign base string</strong></p><p><span style="background-color:rgb(255,255,255);">There are 3 types of APIs that require the use of different parameters to create the sign base string. (consistent with its common parameters).</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">Concatenate the API path (without host) and the common parameters below into a single sign base string in the following order:</span></p><p>&nbsp;</p><ul><li><strong>For Shop APIs</strong>: partner_id, api path, timestamp, access_token, shop_id</li><li><strong>For Merchant APIs</strong>: partner_id, api path, timestamp, access_token, merchant_id</li><li><strong>For Public APIs</strong>: partner_id, api path, timestamp</li></ul><p>&nbsp;</p><p><strong>Calculating the authentication signature</strong></p><p>Use HMAC-SHA256 to hash the sign base string, and use the partner key as the encryption key. The hexadecimal all-lowercase hash value is the authentication signature.</p><p>&nbsp;</p><p>Python Code Demo:</p><pre><code class="python hljs">import hmac
import json
import time
import requests
import hashlib


def shop_auth():
    timest = int(time.time())
    host = "https://partner.shopeemobile.com"
    path = "/api/v2/shop/auth_partner"
    redirect_url = "https://www.baidu.com/"
    partner_id = 80001
    tmp = "test...."
    partner_key = tmp.encode()
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    ##generate api
    url = host + path + "?partner_id=%s&amp;timestamp=%s&amp;sign=%s&amp;redirect=%s" % (partner_id, timest, sign, redirect_url)
    print(url)
</code></pre><p>&nbsp;</p><p>Go Code Demo:</p><pre><code class="go hljs">func auth_shop(){
	timest := strconv.FormatInt(time.Now().Unix(),10)
	host := "https://openplatform.sandbox.test-stable.shopee.sg"
	path := "/api/v2/shop/auth_partner"
	redirectUrl := "https://www.baidu.com/"
	partnerId := strconv.Itoa(2006566)
	partnerKey := "1391fd986fe8ec7569bebed75b0c33ee35eb5a305bed7038657a5cd5f75b1c88"
	baseString := fmt.Sprintf("%s%s%s", partnerId,path,timest)
	h := hmac.New(sha256.New,[]byte(partnerKey))
	h.Write([]byte(baseString))
	sign := hex.EncodeToString(h.Sum(nil))
	url := fmt.Sprintf(host+path+"?partner_id=%s&amp;timestamp=%s&amp;sign=%s&amp;redirect=%s", partnerId,timest,sign, redirectUrl)
	fmt.Println(url)
}</code></pre><p>&nbsp;</p><p>Java Code Demo:</p><pre><code class="java hljs">    //generate auth url
    public static void shop_auth(){
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/shop/auth_partner";
        String redirect_url = "https://www.baidu.com/";
        long partner_id = 123456L;
        String tmp_partner_key = "...";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        String sign = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = String.format("%064x",new BigInteger(1,mac.doFinal(base_string)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String url = host + path + String.format("?partner_id=%s&amp;timestamp=%s&amp;sign=%s&amp;redirect=%s", partner_id,timest, sign, redirect_url);
        System.out.println(url);
    }</code></pre><p>&nbsp;</p><p>PHP Code Demo:</p><pre><code class="php hljs">&lt;?php 


function authShop($partnerId, $partnerKey) {   
    global $host;
    $path = "/api/v2/shop/auth_partner";
    $redirectUrl = "https://www.baidu.com/";

    $timest = time();
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&amp;timestamp=%s&amp;sign=%s&amp;redirect=%s", $host, $path, $partnerId, $timest, $sign, $redirectUrl);
    return $url;
}

$host="https://openplatform.sandbox.test-stable.shopee.sg";

$partnerId = 847892;
$partnerKey = "57615053704d6470644f554a78656d50484143644964436a5568777544524579";

echo authShop($partnerId, $partnerKey);
?&gt;</code></pre><p>&nbsp;</p><p>&nbsp;</p><p><span style="color:rgb(43,44,45);"><strong>GetAccesstoken Demo</strong></span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">Python Code Demo:</span></p><pre><code class="python hljs">print(shop_auth())
# first time request token
def get_token_shop_level(code, partner_id, tmp_partner_key, shop_id):
    timest = int(time.time())
    host = "https://partner.shopeemobile.com"
    path = "/api/v2/auth/token/get"
    body = {"code": code, "shop_id": shop_id, "partner_id": partner_id}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&amp;timestamp=%s&amp;sign=%s" % (partner_id, timest, sign)
    # print(url)
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token


def get_token_account_level(code, partner_id, tmp_partner_key, main_account_id):
    timest = int(time.time())
    host = "https://openplatform.sandbox.test-stable.shopee.sg"
    path = "/api/v2/auth/token/get"
    body = {"code": code, "main_account_id": main_account_id, "partner_id": partner_id}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&amp;timestamp=%s&amp;sign=%s" % (partner_id, timest, sign)

    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token</code></pre><p>&nbsp;</p><p>Java<span style="background-color:rgb(255,255,255);"> Code Demo:</span></p><pre><code class="java hljs">import com.alibaba.fastjson.JSONObject;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.HashMap;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import com.alibaba.fastjson.JSON;


public class shop_auth {
    public static void main(String[] args) throws ParseException, IOException {
        shop_auth();
        //get_token_shop_level(code,partner_id,partner_key,shop_id);
    }
    //generate auth url
    public static void shop_auth(){
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/shop/auth_partner";
        String redirect_url = "https://www.baidu.com/";
        long partner_id = 123456L;
        String tmp_partner_key = "...";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        String sign = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = String.format("%064x",new BigInteger(1,mac.doFinal(base_string)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String url = host + path + String.format("?partner_id=%s&amp;timestamp=%s&amp;sign=%s&amp;redirect=%s", partner_id,timest, sign, redirect_url);
        System.out.println(url);
    }

    //shop request for access token for the first time
    public static String[] get_token_shop_level(String code,long partner_id,String tmp_partner_key,long shop_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/auth/token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&amp;timestamp=%s&amp;sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map&lt;String,Object&gt; map = new HashMap&lt;&gt;();
            map.put("code",code);
            map.put("shop_id",shop_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    }

    //main account request for the access token for the first time
    public static String[] get_token_account_level(String code,long partner_id,String tmp_partner_key,long main_account_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://openplatform.sandbox.test-stable.shopee.sg";
        String path = "/api/v2/auth/token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&amp;timestamp=%s&amp;sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map&lt;String,Object&gt; map = new HashMap&lt;&gt;();
            map.put("code",code);
            map.put("main_account_id",main_account_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    }</code></pre><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">PHP Code Demo:</span></p><pre><code class="php hljs">&lt;?php 

function getTokenShopLevel($code, $partnerId, $partnerKey, $shopId) {
    global $host;
    $path = "/api/v2/auth/token/get";
    
    $timest = time();
    $body = array("code" =&gt; $code,  "shop_id" =&gt; $shopId, "partner_id" =&gt; $partnerId);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&amp;timestamp=%s&amp;sign=%s", $host, $path, $partnerId, $timest, $sign);
    

    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $resp = curl_exec($c);
    echo "raw result: $resp";

    $ret = json_decode($resp, true);
    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: $accessToken, refresh_token: $newRefreshToken raw: $ret"."\n";
    return $ret;
}


function getTokenAccountLevel($code, $partnerId, $partnerKey, $mainAccountId) {
    global $host;
    $path = "/api/v2/auth/token/get";
    
    $timest = time();
    $body = array("code" =&gt; $code,  "main_account_id" =&gt; $mainAccountId, "partner_id" =&gt; $partnerId);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);

    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&amp;timestamp=%s&amp;sign=%s", $host, $path, $partnerId, $timest, $sign);

    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($c);
    echo "\nraw result ".$result."\n";

    $ret = json_decode($result, true);
    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: ".$accessToken.", refresh_token: ".$newRefreshToken."\n";
    return $ret;
}

$host="https://partner.shopeemobile.com";

$partnerId = 847892;
$partnerKey = "57615053704d6470644f554a78656d50484143644964436a5568777544524579";

$code="494d7a4a4f5a66524556776f66425453";

// $shopId=200520705;
// getTokenShopLevel($code, $partnerId, $partnerKey, $shopId);

$accountId=19479;
getTokenAccountLevel($code, $partnerId, $partnerKey, $accountId)

?&gt;</code></pre><h3><span style="color:#2B2C2D;"><strong>RefreshAccessToken</strong></span></h3><p>&nbsp;</p><p>Before the access_token expires, use the refresh_token to call this API to obtain a new access_token and refresh_token. The new refresh_token must be used for the next refresh request.</p><p>&nbsp;</p><p><strong>Request Information</strong></p><figure class="table"><table><thead><tr><th><strong>Path</strong></th><th><strong>Details</strong></th></tr></thead><tbody><tr><td>Production Environment</td><td><a target="_blank" rel="noopener noreferrer" href="https://partner.shopeemobile.com/api/v2/auth/access_token/get"><u>https://partner.shopeemobile.com/api/v2/auth/access_token/get</u></a></td></tr><tr><td>Sandbox Environment</td><td><a target="_blank" rel="noopener noreferrer" href="https://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/access_token/get"><u>https://openplatform.sandbox.test-stable.shopee.sg/api/v2/auth/access_token/get</u></a></td></tr><tr><td>Request Method</td><td>POST</td></tr></tbody></table></figure><figure class="table"><table><tbody><tr><td><p>⚠️<strong> Note</strong></p><p>&nbsp;</p><p>For the same main_account_id, the initial access_token and refresh_token obtained from GetAccessToken are identical. After calling the RefreshAccessToken API separately for each shop_id and merchant_id, each shop_id and merchant_id will generate its own independent new access_token and refresh_token.</p><p>&nbsp;</p><p>For example:<br>1. The initial access_token / refresh_token obtained from GetAccessToken is assigned to 7 shop_ids and 3 merchant_ids.<br>2. After the initial access_token expires, you use the initial refresh_token to call RefreshAccessToken,and obtain 10 independent sets of access_token and refresh_token for each shop_id and merchant_id.<br>3. After this, shop_id and merchant_id will no longer share any access_token or refresh_token.</p></td></tr></tbody></table></figure><p>&nbsp;</p><p>Public parameters:</p><p>&nbsp;</p><p>Consistent with the common parameters of the GetAccessToken API.</p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Required</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>sign</td><td>string</td><td>True</td><td>The signature obtained by sign base string (order: partner_id, api path, timestamp...) HMAC-SHA256 hashing with the partner_key.</td></tr><tr><td>partner_id</td><td>int</td><td>True</td><td>The partner_id obtained from the APP. This partner_id is put into the query.</td></tr><tr><td>timestamp</td><td>int</td><td>True</td><td>Timestamp, valid for 5 minutes.</td></tr></tbody></table></figure><p>&nbsp;</p><p>Request parameters:</p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Required</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>refresh_token</td><td>string</td><td>True</td><td>Use refresh_token to get a new access_token. <span style="background-color:rgb(255,255,255);">Each refresh_token is valid for 30 days, and can only be used once by either a shop_id or merchant_id.</span></td></tr><tr><td>partner_id</td><td>int</td><td>True</td><td>The partner_id obtained from the App. This partner_id is inserted into the body.</td></tr><tr><td>shop_id</td><td>int</td><td rowspan="2"><p>&nbsp;</p><p>&nbsp;</p><p>Yes, input 1 only.&nbsp;</p></td><td><p>The shop_id of the main account that granted authorization to your App. Only the shop_id <strong>or </strong>merchant_id can be selected as the input parameter, and they must be refreshed separately.</p><p><br>&nbsp;</p></td></tr><tr><td>merchant_id</td><td>int</td><td><p>The merchant_id for identifying the main account that granted authorization to your App. Only the shop_id <strong>or </strong>merchant_id can be selected as the input parameter, and they must be refreshed separately.</p><p><br>&nbsp;</p></td></tr></tbody></table></figure><p>&nbsp;</p><p>Response parameters:</p><figure class="table"><table><thead><tr><th><strong>Parameter name</strong></th><th><strong>Type</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td>request_id</td><td>string</td><td><p>ID of API requests; always returned.&nbsp;</p><p>Used to diagnose problems.&nbsp;</p><p><br>&nbsp;</p></td></tr><tr><td>error</td><td>string</td><td><p>Error codes for API requests; always returned.&nbsp;</p><p>When the API call is successful, the error code returned is empty.</p></td></tr><tr><td>refresh_token</td><td>string</td><td><p>New refresh_token</p><p>Returned when the API call is successful.&nbsp;</p><p>Use a refresh_token to get a new access_token.&nbsp;</p><p><span style="background-color:rgb(255,255,255);">Each refresh_token is valid for 30 days, and can only be used once by either a shop_id or merchant_id.</span></p></td></tr><tr><td>access_token</td><td>string</td><td><p>Returned when the API call is successful.&nbsp;</p><p>Each new access_token is a dynamic token that can be used multiple times. It expires after 4 hours.</p></td></tr><tr><td>expire_in</td><td>int</td><td><p>Returned when the API call is successful.&nbsp;</p><p>The validity period of the access_token, in seconds.</p></td></tr><tr><td>message</td><td>string</td><td>Always returned. Provides detailed error information.</td></tr><tr><td>merchant_id</td><td>int</td><td><p>Returned when the API call is successful.&nbsp;</p><p>The merchant_id for this refresh, for identifying each merchant.</p></td></tr><tr><td>shop_id</td><td>int</td><td><p>Returned when the API call is successful.&nbsp;</p><p>The shop_id for this refresh</p></td></tr><tr><td>partner_id</td><td>int</td><td><p>Returned when the API call is successful.&nbsp;</p><p>The partner_id you used for this refresh</p></td></tr><tr><td>supplier_id_list</td><td>int[]</td><td>Return when auth_type=supplier</td></tr><tr><td>user_id_list</td><td>int[]</td><td>Return when auth_type=user</td></tr></tbody></table></figure><p>&nbsp;</p><p><span style="color:rgb(43,44,45);"><strong>RefreshAccessToken Demo</strong></span></p><p>&nbsp;</p><p>Python Code Demo:</p><pre><code class="python hljs"># refresh token


def get_access_token_shop_level(shop_id, partner_id, tmp_partner_key, refresh_token):
    timest = int(time.time())
    host = "https://openplatform.sandbox.test-stable.shopee.sg"
    path = "/api/v2/auth/access_token/get"
    body = {"shop_id": shop_id, "refresh_token": refresh_token,"partner_id":partner_id}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&amp;timestamp=%s&amp;sign=%s" % (partner_id, timest, sign)
    # print(url)
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token


def get_access_token_merchant_level(merchant_id, partner_id, tmp_partner_key, refresh_token):
    timest = int(time.time())
    host = "https://openplatform.sandbox.test-stable.shopee.sg"
    path = "/api/v2/auth/access_token/get"
    body = {"merchant_id": merchant_id, "refresh_token": refresh_token}
    tmp_base_string = "%s%s%s" % (partner_id, path, timest)
    base_string = tmp_base_string.encode()
    partner_key = tmp_partner_key.encode()
    sign = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()
    url = host + path + "?partner_id=%s&amp;timestamp=%s&amp;sign=%s" % (partner_id, timest, sign)

    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=body, headers=headers)
    ret = json.loads(resp.content)
    access_token = ret.get("access_token")
    new_refresh_token = ret.get("refresh_token")
    return access_token, new_refresh_token

partner_id = 2006566
partner_key = "1a78dde5d6c3342f56ac939cbdd81607654c0e87725e118736ba5e3ae31c579c"
shop_id = 602226924
main_account_id = 31219
merchant_id = 45719
code = "c01204cada7b4cd0e4688154f5a256ca"
print(shop_auth())
# access_token,refresh_token = get_token_shop_level(code,partner_id,partner_key,602226924)
# print(access_token)
# print(refresh_token)
# print(get_access_token_shop_level(shop_id,partner_id,partner_key,refresh_token))


access_token,refresh_token = get_token_account_level(code,partner_id,partner_key,main_account_id)
print(access_token)
print(refresh_token)
print(get_access_token_merchant_level(merchant_id,partner_id,partner_key,refresh_token))
   </code></pre><p>&nbsp;</p><p>Java<span style="background-color:rgb(255,255,255);"> Code Demo:</span></p><pre><code class="java hljs">
    //shop refresh the access token
    public static String[] get_access_token_shop_level(String refresh_token,long partner_id,String tmp_partner_key,long shop_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/auth/access_token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&amp;timestamp=%s&amp;sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map&lt;String,Object&gt; map = new HashMap&lt;&gt;();
            map.put("refresh_token",refresh_token);
            map.put("shop_id",shop_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    }

    //merchant refresh the access token
    public static String[] get_access_token_merchant_level(String refresh_token,long partner_id,String tmp_partner_key,long merchant_id) throws ParseException,IOException{
        String[] res = new String[2];
        long timest = System.currentTimeMillis() / 1000L;
        String host = "https://partner.shopeemobile.com";
        String path = "/api/v2/auth/access_token/get";
        String tmp_base_string = String.format("%s%s%s", partner_id, path, timest);
        byte[] partner_key;
        byte[] base_string;
        BigInteger sign = null;
        String result = "";
        try {
            base_string = tmp_base_string.getBytes("UTF-8");
            partner_key = tmp_partner_key.getBytes("UTF-8");
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(partner_key, "HmacSHA256");
            mac.init(secret_key);
            sign = new BigInteger(1,mac.doFinal(base_string));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String tmp_url = host + path + String.format("?partner_id=%s&amp;timestamp=%s&amp;sign=%s", partner_id,timest, String.format("%032x",sign));
        URL url = new URL(tmp_url);
        HttpURLConnection conn = null;
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            Map&lt;String,Object&gt; map = new HashMap&lt;&gt;();
            map.put("refresh_token",refresh_token);
            map.put("merchant_id",merchant_id);
            map.put("partner_id",partner_id);
            String json = JSON.toJSONString(map);
            conn.connect();
            out = new PrintWriter(conn.getOutputStream());
            out.print(json);
            out.flush();
            in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while((line=in.readLine())!=null){
                result +=line;
            }
            JSONObject jsonObject = JSONObject.parseObject(result);
            res[0] = (String) jsonObject.get("access_token");
            res[1] = (String) jsonObject.get("refresh_token");
        } catch(Exception e){
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
            }
        }
        return res;
    }
}</code></pre><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">PHP Code Demo:</span></p><pre><code class="php hljs">&lt;?php 

function getAccessTokenShopLevel($partnerId, $partnerKey, $shopId, $refreshToken) {
    global $host;
    $path = "/api/v2/auth/access_token/get";
    
    $timest = time();
    $body = array("partner_id" =&gt; $partnerId, "shop_id" =&gt; $shopId, "refresh_token" =&gt; $refreshToken);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&amp;timestamp=%s&amp;sign=%s", $host, $path, $partnerId, $timest, $sign);


    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($c);
    echo "\nraw result ".$result."\n";

    $ret = json_decode($result, true);

    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: ".$accessToken.", refresh_token: ".$newRefreshToken."\n";
    return $ret;
}

function getAccessTokenMerchantLevel($partnerId, $partnerKey, $merchantId, $refreshToken) {
    global $host;
    $path = "/api/v2/auth/access_token/get";
    
    $timest = time();
    $body = array("partner_id" =&gt; $partnerId, "merchant_id" =&gt; $merchantId, "refresh_token" =&gt; $refreshToken);
    $baseString = sprintf("%s%s%s", $partnerId, $path, $timest);
    $sign = hash_hmac('sha256', $baseString, $partnerKey);
    $url = sprintf("%s%s?partner_id=%s&amp;timestamp=%s&amp;sign=%s", $host, $path, $partnerId, $timest, $sign);


    $c = curl_init($url);
    curl_setopt($c, CURLOPT_POST, 1);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($c);
    echo "\nraw result ".$result."\n";

    $ret = json_decode($result, true);
    $accessToken = $ret["access_token"];
    $newRefreshToken = $ret["refresh_token"];
    echo "\naccess_token: ".$accessToken.", refresh_token: ".$newRefreshToken."\n";
    return $ret;
}

$host="https://partner.shopeemobile.com";

$partnerId = 847892;
$partnerKey = "57615053704d6470644f554a78656d50484143644964436a5568777544524579";




// $shopId=200520705;
// $shopRefreshToken="71724c4e68746b546965424c70617244";
// getAccessTokenShopLevel($partnerId, $partnerKey, $shopId, $shopRefreshToken)

$merchantId=1018829;
$merchantRefreshToken="546e5064627042696756455277774f53";
getAccessTokenMerchantLevel($partnerId, $partnerKey, $merchantId, $merchantRefreshToken)

?&gt;</code></pre><h3><span style="color:#2B2C2D;"><strong>Refreshing the access_token and refresh_token on a shop account</strong></span></h3><p>&nbsp;</p><p><strong>1. Use the code and shop_id from the redirect URL</strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/?code=7867624d4e76616648544f6e52625557&amp;shop_id=54804"><strong> <u>https://open.shopee.com/?code=7867624d4e76616648544f6e52625557&amp;shop_id=54804</u></strong></a><strong> to call the GetAccessToken API to obtain the first pair of access_token and refresh_token.</strong></p><p>&nbsp;</p><p>Query: https://partner.shopeemobile.com/api/v2/auth/token/get?partner_id=1000016&amp;timestamp=1657263479&amp;sign=9c685bc7e4a74e90f45fe1933f1d72b2d9705acda4093a9fb1ec7e2b57ccea2a</p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">{"shop_id":54804,</span></p><p><span style="background-color:rgb(255,255,255);">"code":"7867624d4e76616648544f6e52625557",</span></p><p><span style="background-color:rgb(255,255,255);">"partner_id":1000016</span></p><p><span style="background-color:rgb(255,255,255);">}</span></p><p>&nbsp;</p><p><strong>2.Save the first pair of access_token and refresh_token returned.</strong></p><p><span style="background-color:rgb(255,255,255);">{</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "refresh_token": "456e416149664b76745a6a794156794a",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "access_token": "6a55746e61546f707579627656637464",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "expire_in": 13859,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "request_id": "c040b886cfcabdfa5a23af51c595cd1b",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "error": "",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "message": ""</span></p><p><span style="background-color:rgb(255,255,255);">}</span></p><p>&nbsp;</p><p><strong>3.Call the RefreshAccessToken API to refresh the access_token and refresh_token.</strong></p><p>Query: https://partner.shopeemobile.com<span style="background-color:rgb(255,255,255);color:rgb(33,33,33);">/api/v2/auth/access_token/get</span>?partner_id=1000016&amp;timestamp=1657263479&amp;sign=9c685bc7e4a74e90f45fe1933f1d72b2d9705acda4093a9fb1ec7e2b57ccea2a</p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">{"shop_id":54804,</span></p><p><span style="background-color:rgb(255,255,255);">"refresh_token":"456e416149664b76745a6a794156794a",</span></p><p><span style="background-color:rgb(255,255,255);">"partner_id":1000016</span></p><p><span style="background-color:rgb(255,255,255);">}</span></p><p>&nbsp;</p><p><strong>4.Save the new access_token and refresh_token.</strong></p><p><span style="background-color:rgb(255,255,255);">{</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "partner_id": 1000016,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "refresh_token": "666478546b6c63464867685554477a57",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "access_token": "7a5970754768697552654a466f425573",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "expire_in": 14400,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "request_id": "6d79dd0ffe4e070e185c71ca5153cd51",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "error": "",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "message": "",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp; "shop_id": 54804</span></p><p><span style="background-color:rgb(255,255,255);">}</span></p><h3><span style="color:#2B2C2D;"><strong>Refreshing the access_token and refresh_token on a main account</strong></span></h3><p>&nbsp;</p><p><strong>1.Use the code and main_account_id from the URL obtained during authorization to call the GetAccessToken API and obtain the first pair of access_token and refresh_token.</strong></p><p><strong>Redirect URL: : https://open.shopee.com/?code=644d4e48787873706c5a444c776d4b59&amp;main_account_id=10208</strong></p><p>&nbsp;</p><p>Query: https://partner.shopeemobile.com/api/v2/auth/token/get?partner_id=1000016&amp;timestamp=1657263479&amp;sign=9c685bc7e4a74e90f45fe1933f1d72b2d9705acda4093a9fb1ec7e2b57ccea2a</p><p>{"main_account_id":10208,</p><p>"code":"644d4e48787873706c5a444c776d4b59",</p><p>"partner_id":1000016</p><p>}</p><p>&nbsp;</p><p><strong>2.Save the first pair of access_token and refresh_token returned.</strong></p><p>&nbsp;</p><p>{</p><p>&nbsp;&nbsp; "refresh_token": "684d42685667777868597a4477587455",</p><p>&nbsp;&nbsp; "access_token": "44776151594778486943647644745361",</p><p>&nbsp;&nbsp; "expire_in": 14344,</p><p>&nbsp;&nbsp; "request_id": "9199e13ee74b22411498209cb5516e24",</p><p>&nbsp;&nbsp; "merchant_id_list": [</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1001705</p><p>&nbsp;&nbsp;&nbsp;],</p><p>&nbsp;&nbsp; "shop_id_list": [</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 33142,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 46154</p><p>&nbsp;&nbsp;&nbsp;],</p><p>&nbsp;&nbsp; "error": "",</p><p>&nbsp;&nbsp; "message": ""</p><p>}</p><p>&nbsp;</p><p><strong>3.Call the RefreshAccessToken API to refresh the access_token and refresh_token of shop_id and merchant_id respectively</strong></p><p>&nbsp;</p><p>Query: <span style="background-color:rgb(255,255,255);">https://partner.shopeemobile.com/api/v2/auth/access_token/get?partner_id=1000016&amp;timestamp=1657868745&amp;sign=b78833ddcf533903cfae818bbfcf2b6b630e3bc0c941dd65453632f63bf7b495</span></p><p><span style="background-color:rgb(255,255,255);">{"shop_id":33142,</span></p><p><span style="background-color:rgb(255,255,255);">"refresh_token":"684d42685667777868597a4477587455",</span></p><p><span style="background-color:rgb(255,255,255);">"partner_id":1000016</span></p><p><span style="background-color:rgb(255,255,255);">}</span></p><p>Query: <span style="background-color:rgb(255,255,255);">https://partner.shopeemobile.com/api/v2/auth/access_token/get?partner_id=1000016&amp;timestamp=1657868745&amp;sign=b78833ddcf533903cfae818bbfcf2b6b630e3bc0c941dd65453632f63bf7b495</span></p><p><span style="background-color:rgb(255,255,255);">{"merchant_id":1001705,</span></p><p><span style="background-color:rgb(255,255,255);">"refresh_token":"684d42685667777868597a4477587455",</span></p><p><span style="background-color:rgb(255,255,255);">"partner_id":1000016</span></p><p><span style="background-color:rgb(255,255,255);">}</span></p><p>&nbsp;</p><p><strong>4.Save the new access_token and refresh_token.</strong></p><p>&nbsp;</p><p>{</p><p>&nbsp;&nbsp; "partner_id": 1000016,</p><p>&nbsp;&nbsp; "refresh_token": "417472546e73504949676279576c477a",</p><p>&nbsp;&nbsp; "access_token": "646d474965714a696177764963775743",</p><p>&nbsp;&nbsp; "expire_in": 14400,</p><p>&nbsp;&nbsp; "request_id": "78e64d11cb6dec6f6669282839fca916",</p><p>&nbsp;&nbsp; "error": "",</p><p>&nbsp;&nbsp; "message": "",</p><p>&nbsp;&nbsp; "shop_id": 33142</p><p>}</p><p>{</p><p>&nbsp;&nbsp; "partner_id": 1000016,</p><p>&nbsp;&nbsp; "refresh_token": "715075736d6c6570544364774f437369",</p><p>&nbsp;&nbsp; "access_token": "69634c664a7350696c6b466d5a53714a",</p><p>&nbsp;&nbsp; "expire_in": 14400,</p><p>&nbsp;&nbsp; "request_id": "51eacbc81bd6fa8fddddf1e0ef2dee16",</p><p>&nbsp;&nbsp; "error": "",</p><p>&nbsp;&nbsp; "message": "",</p><p>&nbsp;&nbsp; "merchant_id": 1001705</p><p>}</p><p>&nbsp;</p><p>By following the steps above, you can call the RefreshAccessToken API&nbsp; within 4 hours to get new access_token and refresh_token. Maintaining the API call loop will ensure you can continue to obtain new sets of access_token and refresh_token within the authorization validity period.&nbsp;</p><figure class="table"><table><tbody><tr><td><p>⚠️<strong> Note</strong></p><p>If you did not save the new refresh_token and access_token returned, <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=177&amp;sub=180&amp;page=1&amp;faq=216"><u>see possible solutions</u></a>.</p></td></tr></tbody></table></figure><h1><span style="color:#2B2C2D;">Canceling authorization</span></h1><p>&nbsp;</p><p>You can cancel an authorization by changing the authorization URL or via Seller Center.</p><h3><span style="color:#2B2C2D;">Canceling authorization by changing the authorization URL</span></h3><p>&nbsp;</p><p>Authorization can be revoked either by generating a cancellation authorization link or by performing the operation in Seller Center.</p><p>&nbsp;</p><p><strong>Revoking authorization via cancellation link</strong><br>&nbsp;</p><p>The method for generating a cancellation authorization link is the same as that for the authorization link, except that the fixed authorization URL should be replaced with the fixed cancellation authorization URL.</p><p>&nbsp;</p><p><strong>Fixed Cancellation Authorization URL</strong></p><figure class="table"><table><tbody><tr><td><strong>Environment</strong></td><td><strong>Region</strong></td><td><strong>URL</strong></td></tr><tr><td rowspan="3">Production</td><td>Global (excluding Mainland China and Brazil)</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/cancel_auth">https://open.shopee.com/cancel_auth</a></td></tr><tr><td>Mainland China</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.cn/cancel_auth">https://open.shopee.cn/cancel_auth</a></td></tr><tr><td>Brazil</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com.br/cancel_auth">https://open.shopee.com.br/cancel_auth</a></td></tr><tr><td rowspan="3">Sandbox</td><td>Global (excluding Mainland China and Brazil)</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/cancel_auth">https://open.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/auth">sandbox.test-stable.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/cancel_auth">shopee.com/cancel_auth</a></td></tr><tr><td>Mainland China</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.cn/cancel_auth">https://open.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/auth">sandbox.test-stable.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.cn/cancel_auth">shopee.cn/cancel_auth</a></td></tr><tr><td>Brazil</td><td><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com.br/cancel_auth">https://open.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/auth">sandbox.test-stable.</a><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com.br/cancel_auth">shopee.com.br/cancel_auth</a></td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>Cancellation Authorization Link Examples</strong></p><p>&nbsp;</p><p>Production Environment:</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/cancel_auth?partner_id=10090&amp;auth_type=seller&amp;redirect_uri=https://open.shopee.com&amp;response_type=code"><u>https://open.shopee.com/cancel_auth?partner_id=10090&amp;auth_type=seller&amp;redirect_uri=https://open.shopee.com&amp;response_type=code</u></a>&nbsp;&nbsp;&nbsp;</p><p>&nbsp;</p><p>Sandbox Environment:</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.test-stable.shopee.com/cancel_auth?partner_id=1000016&amp;auth_type=seller&amp;redirect_uri=https://open.test-stable.shopee.com&amp;response_type=code"><u>https://open.test-stable.shopee.com/cancel_auth?partner_id=1000016&amp;auth_type=seller&amp;redirect_uri=https://open.test-stable.shopee.com&amp;response_type=code</u></a>&nbsp;&nbsp;</p><p>&nbsp;</p><p><strong>Cancellation Process</strong></p><p>&nbsp;</p><p>1. Generate the cancellation authorization link according to the specifications above;</p><p>2. The seller logs in via the cancellation authorization link;</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=fqiBwLFttdta5Te0%2FnbxzXzFcsupke1%2BNA2OHgx7yb1SY2iwe2LgKaOg0BsWqPAlP3u2RsebI%2F6btGIy3SIXCQ%3D%3D&amp;image_type=png"></figure><p>3. The seller clicks “Cancel Authorization” to complete the process. After cancellation, the application will no longer have access to the seller’s information.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=o9yQ94Cq36TeoBBlNsV9odZZsWQvw%2FOJYgYXVPSV5PmLUFhnbxkEEZiuLnCXbVCeJ1Cs21BXmBtNdTzaC59LJw%3D%3D&amp;image_type=png"></figure><h3><span style="color:#2B2C2D;">Canceling authorization on Seller Center&nbsp;</span></h3><p>&nbsp;</p><p><strong>Local Sellers:</strong></p><ol><li>The seller logs in to Seller Center and navigates to “Home Page &gt; Platform Partner”;</li><li>On the Platform Partner page, the seller can view all apps authorized by the shop / main account, along with their authorization expiration time;</li><li>The seller clicks “Separate” in the action column to revoke authorization for the corresponding application.</li></ol><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=yz4bkpogbbBi5skg05Tr68D2FH7NDD9bdcXDaKojflAyCSNELVaU0efUGodlnzFL7AVUcOfVJk33%2Bh4N%2FfpY8w%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p><strong>CNSC/KRSC Sellers</strong></p><p>“Home Page &gt; Open Platform Management”: Sellers can view which apps have been authorized by the main account. In the authorization management page, sellers can directly revoke the authorization relationship for the merchant or shop.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=DhqmO1dXSCh%2FsgUDweiMAjJNVZoElu%2FWOygNRX%2Bj5snNNZqD%2BkHsIQXsy9dQFXkc%2Br2AX%2F5inJ97WdBjlhVwfA%3D%3D&amp;image_type=png"></figure><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=6mZRmlhbl%2FiGafGlKE2V%2FT9EWJb%2BSgKCqGxEph9mSTRLBnsBerBG5YTJR%2B%2BawQiufyHh2F2RgifSi7DdrLIclg%3D%3D&amp;image_type=png"></figure><h1><span style="color:#2B2C2D;">FAQs on authorization and authentication</span></h1><p>&nbsp;</p><p>If you encounter errors during the authorization process, you can refer to our <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=177&amp;sub=180&amp;page=1&amp;faq=215"><u>FAQs on authorization and authentication.</u></a></p>
```
