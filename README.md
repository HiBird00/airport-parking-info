# airport-parking-info
web service for realtime airport parking infomation with public data.

# `공공데이터와 AWS Lambda`를 활용한 실시간 공항 주차장 정보 제공 웹 서비스
## 사용 언어 및 data
- 공공데이터 : 전국 공항 실시간 주차장 데이터
- AWS Lambda (node.js)
- AWS API Gateway
- AWS S3
- html, css, jquery, mongoDB

## 기능
- 인천, 김포, 광주 등 공항 선택 가능
- 공항별 실시간 주차장 상태 제공 -> 총 주차공간 대비 현재 차량 수, %, 만차·보통·원활
- 공항별 주차요금 표 제공 -> 평일, 주말
- 최종 업데이트 날짜, 시간 표시
<img src="https://user-images.githubusercontent.com/48594896/135780213-12411062-02f4-48c4-87d0-502c69b24385.png" />

## Microservice 아키텍처
<img src="https://user-images.githubusercontent.com/48594896/135780268-21abd78e-f571-4425-b597-607c96813010.png" />

## 화면
<img src="https://user-images.githubusercontent.com/48594896/135780371-9abcbf25-54e5-4fcd-93ec-44d8fc748241.png" />
