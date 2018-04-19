var calculator = new SalaryCalculator();

// 武汉的?
var options = {
  socialInsuranceBase: 3093.30,
  socialInsuranceOrgAndPersonalRatios: {
    yanglao: {org: 14 / 100, personal: 8 /100},
    yiliao: {org: 7 / 100, personal: 2 / 100},
    shiye: {org: 0.64 / 100, personal: 0.2 / 100},
    gongshang: {org: 0.2 / 100, personal: 0},
    shengyu: {org: 0.85 / 100, personal: 0}
  }
};

var typeTitles = {
  yanglao: '养老保险金',
  yiliao: '医疗保险金',
  shiye: '失业保险金',
  gongshang: '工伤保险金',
  shengyu: '生育保险金'
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
    var trHtml = '<tr>'
      + '<td>' + typeTitles[type] + '</td>' 
      + '<td>' + (ratios[type].org * 100).toFixed(2) + '%' + '</td>' 
      + '<td>' + (ratios[type].personal * 100).toFixed(2) + '%' + '</td></tr>';
    html += trHtml;
  }
  table.append(html);
}

function drawPayTable(payInfo) {
  var table = $('#table2');
  var html = '<tr>'
    + '<th>社保类型</th>'
    + '<th>单位应缴</th>'
    + '<th>个人应缴</th></tr>';
  
  for (var type in payInfo.items) {
    var trHtml = '<tr>'
      + '<td>' + typeTitles[type] + '</td>' 
      + '<td>' + (payInfo.items[type].org).toFixed(2) + '</td>' 
      + '<td>' + (payInfo.items[type].personal).toFixed(2) + '</td></tr>';
    html += trHtml;
  }
  table.html(html);
}

$('#btnCalc').click(function() {
  calculator.setOptions(options);
  var result = calculator.calcSocialInsurancePays();
  drawPayTable(result);
  
  var originSalary = + $('#originSalary').val();
  var finalSalary = calculator.calcFinalSalary(originSalary);
  $('#finalSalary').val( finalSalary.toFixed(2) );
});



