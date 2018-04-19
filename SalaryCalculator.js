
function SalaryCalculator() {

  //社保缴费基数，不同地区规定不同，要以工资总额为准。
  var socialInsuranceBase = 0;

  // 各类型社保的个人和单位各自承担比例
  var socialInsuranceOrgAndPersonalRatios = {
    yanglao: {org: 0, personal: 0},   //养老
    yiliao: {org: 0, personal: 0},    //医疗
    shiye: {org: 0, personal: 0},     //失业
    gongshang: {org: 0, personal: 0}, //工伤
    shengyu: {org: 0, personal: 0}    //生育
  };

  this.setOptions = function(options) {
    socialInsuranceBase = options.socialInsuranceBase;
    $.extend(socialInsuranceOrgAndPersonalRatios, options.socialInsuranceOrgAndPersonalRatios);
  }
  
  this.calcSocialInsurancePays = function() {
    var items = {};
    
    for (var type in socialInsuranceOrgAndPersonalRatios) {
      items[type] = {
        org: calcSIPay('org', type),
        personal: calcSIPay('personal', type)
      };
    }
    
    return {
      items: items,
      sum: {
        org: calcSIPay('org'),
        personal: calcSIPay('personal')
      }
    };
  }
  
  this.calcFinalSalary = function(salary) {
    return salary - this.calcSocialInsurancePays().sum.personal;
  }
  
  /*
  应缴纳社保金额
  @param personalOrOrg 个人还是单位
  @param type 如为空,则表示总金额
  */
  function calcSIPay(personalOrOrg, type) {
    var result = {};
    var ratios = socialInsuranceOrgAndPersonalRatios;
    if (type) {
      return socialInsuranceBase * ratios[type][personalOrOrg];
    } else {
      var sum = 0;
      // 遍历各类型社保
      for (var type in ratios) {
        // 将个人比例结果累加
        sum += socialInsuranceBase * ratios[type][personalOrOrg];
      }
      return sum;
    }
  }
}