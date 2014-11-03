$(function () {
	/***  服务配置   URV : 上限  FRV ：下限 ***/
	var server95188 = {
			URV: 20000,
			FRV: 1000
		},
		serverPC = {
			URV: 20000,
			FRV: 1000
		},
		serverWireless = {
			URV: 20000,
			FRV: 1000
		}

	var init = function () {
		var server95188_Val = document.createElement("p"),
			serverPC_Val = document.createElement("p"),
			serverWireless_Val = document.createElement("p");

			server95188_Val.id = "server95188_Val";
			serverPC_Val.id = "serverPC_Val";
			serverWireless_Val.id = "serverWireless_Val";

			server95188_Val.innerText = "0";
			serverPC_Val.innerText = "0";
			serverWireless_Val.innerText = "0";

			server95188_Val.style.top = "780px";
			serverPC_Val.style.top = "1360px";
			serverWireless_Val.style.top = "1860px";

			document.getElementById('serverFlow_main').appendChild(server95188_Val);
			document.getElementById('serverFlow_main').appendChild(serverPC_Val);
			document.getElementById('serverFlow_main').appendChild(serverWireless_Val);

	}
	init();
});
