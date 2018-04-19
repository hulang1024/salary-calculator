var calculator = new SalaryCalculator();

var options = {
  socialInsuranceBase: 3093.30,
  socialInsuranceOrgAndPersonalRatios: {
    yanglao: {org: 14 / 100, personal: 8 /100},
    yiliao: {org: 7 / 100, personal: 2 / 100},
    shiye: {org: 0.64 / 100, personal: 0.2 / 100},
    gongshang: {org: 0.2 / 100, personal: 0},
    shengyu: {org: 0.85 / 100, personal: 0}
  },
  socialInsuranceBase: 1500,
  housingAccFundOrgAndPersonalRatios: {
    org: 5 / 100,
    personal: 5 / 100
  }
};

calculator.setOptions(options);

var typeTitles = {
  yanglao: '养老保险',
  yiliao: '医疗保险',
  shiye: '失业保险',
  gongshang: '工伤保险',
  shengyu: '生育保险'
};

initSOAPRTable();

function initSOAPRTable() {
  var table = $('#table1');
  var html = '<tr>'
    + '<th>社保类型</th>'
    + '<th>单位承担比例</th>'
    + '<th>个人承担比例</th></tr>';

  var ratios = options.socialInsuranceOrgAndPersonalRatios;
  for (var type in ratios) {
    html += '<tr>'
      + '<td>' + typeTitles[type] + '</td>'
      + '<td>' + (ratios[type].org * 100).toFixed(2) + '%' + '</td>'
      + '<td>' + (ratios[type].personal * 100).toFixed(2) + '%' + '</td></tr>';
  }
  html += '<tr>'
    + '<td>' + '保险金总计' + '</td>'
    + '<td>' + (calculator.calcSocialInsuranceRatioSums().org * 100).toFixed(2) + '%' + '</td>'
    + '<td>' + (calculator.calcSocialInsuranceRatioSums().personal * 100).toFixed(2) + '%' + '</td></tr>';

  html += '<tr>'
    + '<th>公积金</th>'
    + '<th>单位承担比例</th>'
    + '<th>个人承担比例</th></tr>';

  var ratios = options.housingAccFundOrgAndPersonalRatios;
  html += '<tr>'
    + '<td>公积金</td>'
    + '<td>' + (ratios.org * 100).toFixed(2) + '%' + '</td>'
    + '<td>' + (ratios.personal * 100).toFixed(2) + '%' + '</td></tr>';

  table.append(html);
}

function drawPayTable(payInfo) {
  var table = $('#table2');
  var html = '<tr>'
    + '<th>社保类型</th>'
    + '<th>单位应缴</th>'
    + '<th>个人应缴</th></tr>';

  for (var type in payInfo.socialInsurance.items) {
    html += '<tr>'
      + '<td>' + typeTitles[type] + '</td>'
      + '<td>' + payInfo.socialInsurance.items[type].org.toFixed(2) + '</td>'
      + '<td>' + payInfo.socialInsurance.items[type].personal.toFixed(2) + '</td></tr>';
  }

  html += '<tr>'
    + '<td>保险金总计</td>'
    + '<td>' + payInfo.socialInsurance.sums.org.toFixed(2) + '</td>'
    + '<td>' + payInfo.socialInsurance.sums.personal.toFixed(2) + '</td></tr>';

  html += '<tr>'
    + '<th>公积金</th>'
    + '<th>单位应缴</th>'
    + '<th>个人应缴</th></tr>';

  html += '<tr>'
    + '<td>公积金</td>'
    + '<td>' + payInfo.housingAccFund.org.toFixed(2) + '</td>'
    + '<td>' + payInfo.housingAccFund.personal.toFixed(2) + '</td></tr>';
  table.html(html);
}

$('#btnCalc').click(function() {
  options.socialInsuranceBase = +$('#socialInsuranceBase').val() || 0;
  $('#socialInsuranceBase').val(options.socialInsuranceBase);
  options.housingAccFundBase = +$('#housingAccFundBase').val() || 0;
  $('#housingAccFundBase').val(options.housingAccFundBase);
  options.personalHousingAccFundNotPay = $('#personalHousingAccFundNotPay').prop('checked');

  calculator.setOptions(options);
  var result = calculator.calcPays();
  drawPayTable(result);

  var originSalary = + $('#originSalary').val();
  var finalSalary = calculator.calcPersonalFinalSalary(originSalary);
  $('#finalSalary').text( finalSalary.toFixed(2) );
});
