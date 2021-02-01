$(function() {
var temp;
	$('.airport-list').on('click','li', function(){
		$('.airport-list li').css('color','#A1A1A1');

		$(this).css('color','white');


		$('.detail li').remove();
		var proxy = $(this).attr('class');
		temp = proxy;
		saveDate(proxy);
		
	});

	

}) 

function saveDate(proxy){
	var gateAPI = 'https://e17ric525e.execute-api.us-east-1.amazonaws.com/2020-12-13/parking';
	$.post(gateAPI, JSON.stringify({"air":proxy}), function(data){
		//console.log(data);
		getData(proxy);
	},'json');
	console.log(proxy);

}

function getData(proxy){
	var gateAPI = 'https://e17ric525e.execute-api.us-east-1.amazonaws.com/2020-12-13/parking/';
	var proxy = proxy;
	$.ajax({
		url:gateAPI+proxy,
		crossDomain:true,
		type : "GET",
		contentType:'application/json',
		dataType:"json",
		success:function(data){
			//let json = data[0]['item'];
			if(data['condition']==null){
				var $ul = $('.detail');
				var $li = $('<li/>',{
					class:'error',
					text: '재시도 해주세요.'
				})
				$ul.append($li);
			}else{
				let cond_json = data['condition'][0]['item'];
				let pay_json = data['pay'][0]['item'];
				var $ul = $('.detail');
				for(var i = 0; i<cond_json.length; i++){
					var indx;
					var isIn = true;
					for(var j =0; j<pay_json.length;j++){
						if(proxy=='PUS'){
							var p1 = cond_json[i]['parkingAirportCodeName']._text.substr(0,2);
							if(pay_json[j]['parkingParkingName']._text.includes(p1)){
								indx = j;
								break;
							}
						}
						else if(cond_json[i]['parkingAirportCodeName']._text.replace(/(\s*)/g, "") == pay_json[j]['parkingParkingName']._text.replace(/(\s*)/g, "")){
							indx = j;
							break;
						}
						if(j == pay_json.length-1){
							isIn = false;
						}
					}

					var $li = $('<li/>', {
						class:proxy
					})
					var $area_wrap = $('<div/>',{
						class:'area-wrap'
					})
					var $detail_update = $('<div/>',{
						class : 'detail-update'
					})
					// var $img = $('<img/>',{
					// 	class:'reload',
					// 	src : 'img/reload.png'
					// })
					var $span = $('<span/>',{
						text : '최종 업데이트 '
					})
					var $span2 = $('<span/>',{
						text : cond_json[i]['sysGetdate']._text + "  " + cond_json[i]['sysGettime']._text
					})
					//$detail_update.append($img);
					$detail_update.append($span);
					$detail_update.append($span2);
					$area_wrap.append($detail_update);

					/* detail-name */
					var $detail_name = $('<div/>',{
						class : 'detail-name'
					})
					var $span = $('<span/>',{
						text : cond_json[i]['airportKor']._text + " " + cond_json[i]['airportEng']._text
					})
					var $h4 = $('<h4/>',{
						text : cond_json[i]['parkingAirportCodeName']._text
					})

					$detail_name.append($span);
					$detail_name.append($h4);
					$area_wrap.append($detail_name);

					/* condition-container */
					var $condition_container = $('<div/>',{
						class:'condition-container'
					});
					var $detail_condition = $('<div/>',{
						class : 'detail-condition'
					})
					var $span = $('<span/>',{
						class:'cond1',
						text : '혼합 상태'
					})
					var conditon = cond_json[i]['parkingCongestion']._text;
					var className;
					switch(conditon){
						case '원활':
						className = 'cond2 good';
						break;
						case '혼잡':
						className = 'cond2 congestion'
						break;
						case '만차':
						className = 'cond2 full'
						break;
					}

					var $span2 = $('<span/>',{
						class: className,
						text : cond_json[i]['parkingCongestion']._text
					})
					var $span3 = $('<span/>',{
						class:'cond3',
						text : '('+cond_json[i]['parkingCongestionDegree']._text +')'
					})
					$detail_condition.append($span);
					$detail_condition.append($span2);
					$detail_condition.append($span3);
					$condition_container.append($detail_condition);



					var $detail_carnumber = $('<div/>',{
						class : 'detail-carnumber'
					})
					var $span = $('<span/>',{
						class:'car1',
						text : '입고 차량 수 / 전체 주차면 수'
					})
					var $span2 = $('<span/>',{
						class:'car2',
						text : cond_json[i]['parkingOccupiedSpace']._text
					})
					var $span3 = $('<span/>',{
						class:'car3',
						text : ' / '
					})
					var $span4 = $('<span/>',{
						class:'car4',
						text : cond_json[i]['parkingTotalSpace']._text
					})
					$detail_carnumber.append($span);
					$detail_carnumber.append($span2);
					$detail_carnumber.append($span3);
					$detail_carnumber.append($span4);
					$condition_container.append($detail_carnumber);


					$area_wrap.append($condition_container);

					if(isIn){
						/* pay-container */
						var $pay_container = $('<div/>',{
							class:'pay-container'
						});
						var $pay_area = $('<div/>',{
							class : 'pay-area'
						})
					// var $h3 = $('<h3/>',{
					// 	text : '주차요금'
					// })
					// $pay_area.append($h3);
					$pay_container.append($pay_area);

					var $detail_weekpay = $('<div/>',{
						class:'detail-weekpay',
					})
					var $weekpay = $('<div/>',{
						class:'weekpay',
					})

					/* TABLE */
					var $table = $('<table/>');
					var $thead = $('<thead/>');
					var $th = $('<th/>',{
						text : "평일"
					})
					var $h3 = $('<h3/>',{
						text : 'weekday'
					})
					$th.append($h3);
					var $th2 = $('<th/>',{
						text : "소형"
					})
					var $th3 = $('<th/>',{
						text : "대형"
					})
					$thead.append($th);
					$thead.append($th2);
					$thead.append($th3);
					$table.append($thead);

					var $tbody = $('<tbody/>');
					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "기본 요금 (원)"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingBasicAccount']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingBasicAccountd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);

					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "기본 분"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingBasicM']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingBasicMd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);

					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "기본 무료 분"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingFreeM']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingFreeMd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);

					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "24시간 요금"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingMaxAccount']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingMaxAccountd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);
					$table.append($tbody);
					$weekpay.append($table);
					$detail_weekpay.append($weekpay);
					$pay_area.append($detail_weekpay);

					/* WEEKEND */
					var $detail_weekpay = $('<div/>',{
						class:'detail-weekpay',
					})
					var $weekpay = $('<div/>',{
						class:'weekpay',
					})

					/* TABLE */
					var $table = $('<table/>');
					var $thead = $('<thead/>');
					var $th = $('<th/>',{
						text : "주말"
					})
					var $h3 = $('<h3/>',{
						text : 'weekend'
					})
					$th.append($h3);
					var $th2 = $('<th/>',{
						text : "소형"
					})
					var $th3 = $('<th/>',{
						text : "대형"
					})
					$thead.append($th);
					$thead.append($th2);
					$thead.append($th3);
					$table.append($thead);

					var $tbody = $('<tbody/>');
					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "기본 요금 (원)"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingHoliBasicAccount']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingHoliBasicAccountd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);

					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "기본 분"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingHoliBasicM']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingHoliBasicMd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);

					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "기본 무료 분"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingHoliFreeM']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingHoliFreeMd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);

					var $tr = $('<tr/>');
					var $td = $('<td/>',{
						text : "24시간 요금"
					})
					var $td2 = $('<td/>',{
						text : pay_json[indx]['parkingHoliMaxAccount']._text
					})
					var $td3 = $('<td/>',{
						text : pay_json[indx]['parkingHoliMaxAccountd']._text
					})
					$tr.append($td);
					$tr.append($td2);
					$tr.append($td3);
					$tbody.append($tr);
					$table.append($tbody);
					$weekpay.append($table);
					$detail_weekpay.append($weekpay);
					$pay_area.append($detail_weekpay);

					$pay_container.append($pay_area);
					$area_wrap.append($pay_container);
				}

				/* 최종 */

				$li.append($area_wrap);
				$ul.append($li);

			}
		}
	}


});
}

function test(){
	var $div = $('<div/>');
	var $div2 = $('<div/>',{
		className : 'test',
		text: "test"
	})
	$div.append($div2);
	$('footer').append($div);
}
