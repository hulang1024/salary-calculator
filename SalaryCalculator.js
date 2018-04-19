
function SalaryCalculator() {

  //社保缴费基数,一般以工资总额为准
  var socialInsuranceBase = 0;
  //各类型社保的个人和单位各自承担比例，不同地区规定不同
  var socialInsuranceOrgAndPersonalRatios = {
    yanglao: {org: 20 / 100, personal: 8 / 100},  //养老
    yiliao: {org: 6 / 100, personal: 2 / 100},    //医疗
    shiye: {org: 2 / 100, personal: 1 / 100},     //失业
    gongshang: {org: 0.8 / 100, personal: 0},     //工伤
    shengyu: {org: 1 / 100, personal: 0}          //生育
  };

  //住房公积金缴费基数,一般以工资总额为准
  var housingAccFundBase = 0;
  //住房公积金个人和单位各自承担比例, 自定义
  var housingAccFundOrgAndPersonalRatios = {
    org: 5 / 100,
    personal: 5 / 100
  };

  var personalHousingAccFundNotPay = false;

  this.setOptions = function(options) {
    socialInsuranceBase = options.socialInsuranceBase;
    housingAccFundBase = options.housingAccFundBase;
    personalHousingAccFundNotPay = options.personalHousingAccFundNotPay;
    $.extend(socialInsuranceOrgAndPersonalRatios, options.socialInsuranceOrgAndPersonalRatios);
    $.extend(housingAccFundOrgAndPersonalRatios, options.housingAccFundOrgAndPersonalRatios);
  }

  this.getOptions = function() {
    return {
      socialInsuranceBase: socialInsuranceBase,
      socialInsuranceOrgAndPersonalRatios: socialInsuranceOrgAndPersonalRatios,
      housingAccFundBaseL: housingAccFundBase,
      housingAccFundOrgAndPersonalRatios: housingAccFundOrgAndPersonalRatios,
      personalHousingAccFundNotPay: personalHousingAccFundNotPay
    };
  }

  this.calcPersonalFinalSalary = function(salary) {
    var pays = this.calcPays();
    var finalSalary = salary - pays.socialInsurance.sums.personal;
    if (!personalHousingAccFundNotPay) {
      finalSalary -= pays.housingAccFund.personal;
    }

    return finalSalary;
  }

  /* 社保承担比例总计 */
  this.calcSocialInsuranceRatioSums = function() {
    function ratioSum(personalOrOrg) {
      var ratios = socialInsuranceOrgAndPersonalRatios;
      var sum = 0;
      for (var type in ratios) {
        sum += ratios[type][personalOrOrg];
      }
      return sum;
    }

    return {
      org: ratioSum('org'),
      personal: ratioSum('personal')
    }
  }

  /* 计算社保和公积金的,个人和单位各自承担具体金额 */
  this.calcPays = function() {

    function calcSocialInsurancePays() {
      function pay(type, personalOrOrg) {
        return socialInsuranceBase * socialInsuranceOrgAndPersonalRatios[type][personalOrOrg];
      }

      function sumPay(personalOrOrg) {
        var sum = 0;
        // 遍历各类型社保, 将个人比例结果累加
        for (var type in socialInsuranceOrgAndPersonalRatios) {
          sum += pay(type, personalOrOrg);
        }
        return sum;
      }

      var items = {};

      for (var type in socialInsuranceOrgAndPersonalRatios) {
        items[type] = {
          org: pay(type, 'org'),
          personal: pay(type, 'personal')
        };
      }

      return {
        items: items,
        sums: {
          org: sumPay('org'),
          personal: sumPay('personal')
        }
      };
    }

    function calcHousingAccFundPays() {
      function pay(personalOrOrg) {
        return housingAccFundBase * housingAccFundOrgAndPersonalRatios[personalOrOrg];
      }

      return {
        org: pay('org'),
        personal: personalHousingAccFundNotPay ? 0 : pay('personal')
      };
    }

    return {
      socialInsurance: calcSocialInsurancePays(),
      housingAccFund: calcHousingAccFundPays()
    };

  }
}
