const dataFrom = {
    "code": 0,
    "desc": "Success",
    "size": 17,
    "data": [
        {
            "groupKey": "version",
            "groupName": "版本信息",
            "item": [
                {
                    "name": "设备类型",
                    "key": "devtype",
                    "type": "string",
                    "maxLength": 64,
                    "readonly": 1,
                    "value": "ZG02-K"
                },
                {
                    "name": "业务软件",
                    "key": "appver",
                    "type": "string",
                    "maxLength": 64,
                    "readonly": 1,
                    "value": "1.19.16_2020-09-07_11:01 YZWBeta ZG02-K"
                },
                {
                    "name": "文件系统",
                    "key": "sysver",
                    "type": "string",
                    "maxLength": 64,
                    "readonly": 1,
                    "value": "5.0.5 2019-09-06 19:30\n"
                },
                {
                    "name": "序列号",
                    "key": "license",
                    "type": "string",
                    "maxLength": 64,
                    "readonly": 1,
                    "value": "33cf3e714305c156"
                }
            ]
        },
        {
            "groupKey": "netinfo",
            "groupName": "网络信息",
            "item": [
                {
                    "name": "Eth0 MAC地址",
                    "key": "macaddr",
                    "type": "string",
                    "maxLength": 20,
                    "readonly": 1,
                    "value": "00:64:87:22:0B:01"
                },
                {
                    "name": "Eth0 IP地址",
                    "key": "ipaddr",
                    "type": "string",
                    "maxLength": 20,
                    "readonly": 1,
                    "value": "192.168.1.231"
                },
                {
                    "name": "Eth0 子网掩码",
                    "key": "maskaddr",
                    "type": "string",
                    "maxLength": 20,
                    "readonly": 1,
                    "value": "255.255.255.0"
                },
                {
                    "name": "默认网关",
                    "key": "gateway",
                    "type": "string",
                    "maxLength": 20,
                    "readonly": 1,
                    "value": "192.168.1.1"
                },
                {
                    "name": "DNS服务器",
                    "key": "DNS",
                    "type": "string",
                    "maxLength": 20,
                    "readonly": 1,
                    "value": "192.168.1.1"
                }
            ]
        },
        {
            "groupKey": "time",
            "groupName": "时间设置",
            "item": [
                {
                    "name": "所在时区",
                    "key": "timezone",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        10,
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                        24
                    ],
                    "optionName": [
                        "(西十二区)夸贾林岛",
                        "(西十一区)中途岛",
                        "(西十区)夏威夷岛",
                        "(西九区)阿拉斯加",
                        "(西八区)蒂华纳",
                        "(西七区)亚利桑那",
                        "(西六区)墨西哥城",
                        "(西五区)印地安那州",
                        "(西四区)加拉加斯",
                        "(西三区)巴西利亚",
                        "(西二区)中大西洋",
                        "(西一区)亚速尔群岛",
                        "(零时区)伦敦",
                        "(东一区)阿姆斯特丹",
                        "(东二区)哈拉雷",
                        "(东三区)巴格达",
                        "(东四区)阿布扎比",
                        "(东五区)叶卡特琳堡",
                        "(东六区)阿拉木图",
                        "(东七区)曼谷",
                        "(东八区)北京",
                        "(东九区)平壤",
                        "(东十区)布里斯班",
                        "(东十一区)马加丹",
                        "(东十二区)奥克兰"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "当前时间",
                    "key": "currenttime",
                    "type": "string",
                    "maxLength": 20,
                    "readonly": 0,
                    "value": "2021-02-01 16:47:40"
                },
                {
                    "name": "时间同步",
                    "key": "time_control",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "不同步管理系统时间 不同步NTP服务器时间",
                        "同步管理系统时间",
                        "同步NTP服务器时间"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "NTP服务器",
                    "key": "ntpServer",
                    "type": "string",
                    "maxLength": 64,
                    "readonly": 0,
                    "value": ""
                },
                {
                    "name": "NTP端口",
                    "key": "ntpPort",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 99999,
                    "readonly": 0,
                    "value": 123
                }
            ]
        },
        {
            "groupKey": "ledctl",
            "groupName": "补光设置",
            "item": [
                {
                    "name": "补光模式",
                    "key": "mode",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "常灭",
                        "常亮",
                        "自动"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "自动熄屏",
                    "key": "closeScreen",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        5,
                        10
                    ],
                    "optionName": [
                        "从不熄屏",
                        "1分钟",
                        "2分钟",
                        "5分钟",
                        "10分钟"
                    ],
                    "readonly": 0,
                    "value": 0
                }
            ]
        },
        {
            "groupKey": "serial",
            "groupName": "串口设置",
            "item": [
                {
                    "name": "波特率",
                    "key": "baudrate",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                    ],
                    "optionName": [
                        "1200",
                        "2400",
                        "4800",
                        "9600",
                        "19200",
                        "38400",
                        "57600",
                        "115200"
                    ],
                    "readonly": 0,
                    "value": 3
                },
                {
                    "name": "数据位",
                    "key": "databit",
                    "type": "enum",
                    "optionValue": [
                        5,
                        6,
                        7,
                        8
                    ],
                    "optionName": [
                        "5",
                        "6",
                        "7",
                        "8"
                    ],
                    "readonly": 0,
                    "value": 8
                },
                {
                    "name": "停止位",
                    "key": "stopbit",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "0",
                        "1",
                        "2"
                    ],
                    "readonly": 0,
                    "value": 1
                },
                {
                    "name": "校验位",
                    "key": "checktype",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        3,
                        4
                    ],
                    "optionName": [
                        "无校验",
                        "奇校验",
                        "偶校验",
                        "标志校验",
                        "空校验"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "串口输出",
                    "key": "putOutType",
                    "type": "enum",
                    "optionValue": [
                        1,
                        2,
                        3,
                        10
                    ],
                    "optionName": [
                        "不输出",
                        "输出人员ID",
                        "输出卡号ID",
                        "用户自定义"
                    ],
                    "readonly": 0,
                    "value": 3
                }
            ]
        },
        {
            "groupKey": "audioctl",
            "groupName": "声音设置",
            "item": [
                {
                    "name": "音量",
                    "key": "level",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 15,
                    "readonly": 0,
                    "value": 7
                }
            ]
        },
        {
            "groupKey": "weigand",
            "groupName": "韦根设置",
            "item": [
                {
                    "name": "韦根类型",
                    "key": "type",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1
                    ],
                    "optionName": [
                        "26位",
                        "34位"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "韦根输入",
                    "key": "InputType",
                    "type": "enum",
                    "optionValue": [
                        1,
                        2,
                        3
                    ],
                    "optionName": [
                        "做HID/PID转换",
                        "不做HID/PID转换",
                        "取后2个字节"
                    ],
                    "readonly": 0,
                    "value": 2
                },
                {
                    "name": "韦根输出",
                    "key": "putOutType",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        10
                    ],
                    "optionName": [
                        "不输出",
                        "输出人员ID",
                        "输出卡号ID",
                        "用户自定义"
                    ],
                    "readonly": 0,
                    "value": 2
                }
            ]
        },
        {
            "groupKey": "vaparam",
            "groupName": "人脸参数",
            "item": [
                {
                    "name": "人脸比对阈值",
                    "key": "SimilarThres",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 100,
                    "readonly": 0,
                    "value": 63,
                    "defaultValue": 80
                },
                {
                    "name": "人脸检测阈值",
                    "key": "DetThres",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 100,
                    "readonly": 0,
                    "value": 61,
                    "defaultValue": 65
                },
                {
                    "name": "活体检测阈值",
                    "key": "LiveThres",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 100,
                    "readonly": 0,
                    "value": 63,
                    "defaultValue": 50
                },
                {
                    "name": "活体识别等级",
                    "key": "LiveSwitch",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "快速识别，不拒绝照片",
                        "能拒绝照片+视频",
                        "能拒绝部分照片+视频"
                    ],
                    "readonly": 0,
                    "value": 0,
                    "defaultValue": 2
                },
                {
                    "name": "人脸识别距离",
                    "key": "Distance",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ],
                    "optionName": [
                        "无限制",
                        "0.5米以内",
                        "1米以内",
                        "1.5米以内",
                        "2米以内",
                        "3米以内",
                        "4米以内"
                    ],
                    "readonly": 0,
                    "value": 0,
                    "defaultValue": 0
                },
                {
                    "name": "安全帽检测",
                    "key": "safetyhatDecect",
                    "type": "boolean",
                    "readonly": 0,
                    "value": 0
                }
            ]
        },
        {
            "groupKey": "switchCtrl",
            "groupName": "开关量配置",
            "item": [
                {
                    "name": "开关量输出",
                    "key": "switchOutput",
                    "type": "boolean",
                    "readonly": false,
                    "value": true
                },
                {
                    "name": "输出模式",
                    "key": "switchOutMode",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1
                    ],
                    "optionName": [
                        "高电平开闸",
                        "低电平开闸"
                    ],
                    "readonly": false,
                    "value": 0
                },
                {
                    "name": "抬闸脉冲时长(ms)",
                    "key": "outputInterval",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 10000,
                    "readonly": 0,
                    "value": 2000
                },
                {
                    "name": "延迟输出开闸时长(ms)",
                    "key": "outputDelay",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 5000,
                    "readonly": 0,
                    "value": 0
                }
            ]
        },
        {
            "groupKey": "VoiceTips",
            "groupName": "终端语音提示配置",
            "item": [
                {
                    "name": "识别成功",
                    "key": "SuccessTips",
                    "type": "enum",
                    "optionValue": [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ],
                    "optionName": [
                        "识别成功",
                        "请通行",
                        "验证通过",
                        "欢迎光临",
                        "欢迎回家",
                        "请慢走",
                        "一路平安",
                        "请戴安全帽"
                    ],
                    "readonly": 0,
                    "value": 2
                },
                {
                    "name": "识别失败",
                    "key": "FailTips",
                    "type": "enum",
                    "optionValue": [
                        1,
                        2
                    ],
                    "optionName": [
                        "未授权",
                        "陌生人"
                    ],
                    "readonly": 0,
                    "value": 1
                }
            ]
        },
        {
            "groupKey": "ProductNameSet",
            "groupName": "设置产品名称",
            "item": [
                {
                    "name": "产品名称",
                    "key": "UIName",
                    "type": "string",
                    "maxLength": 100,
                    "readonly": 0,
                    "value": "芊熠智能科技有限公司"
                }
            ]
        },
        {
            "groupKey": "OpenDoorModeSet",
            "groupName": "通行模式设置",
            "item": [
                {
                    "name": "通行模式",
                    "key": "OpenDoor",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        3,
                        4
                    ],
                    "optionName": [
                        "刷脸模式",
                        "人卡合一",
                        "刷卡模式",
                        "人证模式",
                        "人证白名单模式"
                    ],
                    "readonly": 0,
                    "value": 0
                }
            ]
        },
        {
            "groupKey": "LightColorModeSet",
            "groupName": "指示灯颜色设置",
            "item": [
                {
                    "name": "识别成功",
                    "key": "SuccessColor",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "绿色",
                        "红色",
                        "全灭"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "识别失败",
                    "key": "FailColor",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "绿色",
                        "红色",
                        "全灭"
                    ],
                    "readonly": 0,
                    "value": 1
                },
                {
                    "name": "无识别结果",
                    "key": "NoResultColor",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "绿色",
                        "红色",
                        "全灭"
                    ],
                    "readonly": 0,
                    "value": 2
                }
            ]
        },
        {
            "groupKey": "IOInputFun",
            "groupName": "IO输入功能配置",
            "item": [
                {
                    "name": "IO输入功能",
                    "key": "inputFunction",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "韦根输入",
                        "电平量输入",
                        "开关量输入"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "序号",
                    "key": "ioInputNum",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1
                    ],
                    "optionName": [
                        "0",
                        "1"
                    ],
                    "readonly": 0,
                    "value": 0,
                    "relation": {
                        "ioInputType": [
                            1,
                            1
                        ],
                        "alarmValidTime": [
                            200,
                            200
                        ],
                        "alarmTimes": [
                            2,
                            0
                        ],
                        "alarmTrigMs": [
                            88762787,
                            10000
                        ]
                    }
                },
                {
                    "name": "输入检测类型",
                    "key": "ioInputType",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "高电平",
                        "低电平",
                        "变化"
                    ],
                    "readonly": 0,
                    "value": 1
                },
                {
                    "name": "输入检测类型",
                    "key": "ioInputType1",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "断开",
                        "闭合",
                        "变化"
                    ],
                    "readonly": 0,
                    "value": 1
                },
                {
                    "name": "状态有效时长(ms)",
                    "key": "alarmValidTime",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 5000,
                    "readonly": 0,
                    "value": 200
                },
                {
                    "name": "告警上报次数",
                    "key": "alarmTimes",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "不上报",
                        "上报1次",
                        "持续上报"
                    ],
                    "readonly": 0,
                    "value": 2
                },
                {
                    "name": "告警触发时长(ms)",
                    "key": "alarmTrigMs",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 10000,
                    "readonly": 0,
                    "value": 88762787
                }
            ]
        },
        {
            "groupKey": "StrangerParam",
            "groupName": "陌生人配置",
            "item": [
                {
                    "name": "识别使能",
                    "key": "strangerIdentifyEn",
                    "type": "boolean",
                    "readonly": 0,
                    "value": 1
                },
                {
                    "name": "允许通行",
                    "key": "strangerOpenDoorEn",
                    "type": "boolean",
                    "readonly": 0,
                    "value": 0
                }
            ]
        },
        {
            "groupKey": "HttpPush",
            "groupName": "HTTP推送",
            "item": [
                {
                    "name": "启用",
                    "key": "httpPushEnable",
                    "type": "boolean",
                    "readonly": 0,
                    "value": 1
                },
                {
                    "name": "服务器地址",
                    "key": "httpServerAddr",
                    "type": "string",
                    "maxLength": 64,
                    "readonly": 0,
                    "value": "113.247.238.148/api/receiver/open"
                },
                {
                    "name": "服务器备用地址",
                    "key": "httpServerAddrStandby",
                    "type": "string",
                    "maxLength": 64,
                    "readonly": 0,
                    "value": ""
                },
                {
                    "name": "服务器端口",
                    "key": "httpServerPort",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 65535,
                    "readonly": 0,
                    "value": 8765
                },
                {
                    "name": "超时时间(s)",
                    "key": "timeout",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 1000,
                    "readonly": 0,
                    "value": 60
                },
                {
                    "name": "字符编码",
                    "key": "charcode",
                    "type": "enum",
                    "optionValue": [
                        0
                    ],
                    "optionName": [
                        "UTF-8"
                    ],
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "心跳间隔(s)",
                    "key": "heartbeat_interval",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 65535,
                    "readonly": 0,
                    "value": 10
                },
                {
                    "name": "私有协议",
                    "key": "private_protocol",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 65535,
                    "readonly": 0,
                    "value": 8
                },
                {
                    "name": "ssl连接启用",
                    "key": "sslenable",
                    "type": "boolean",
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "ssl端口",
                    "key": "sslport",
                    "type": "integer",
                    "minValue": 0,
                    "maxValue": 65535,
                    "readonly": 0,
                    "value": 433
                },
                {
                    "name": "appid",
                    "key": "appid",
                    "type": "string",
                    "maxLength": 127,
                    "readonly": 0,
                    "value": ""
                },
                {
                    "name": "appSecret",
                    "key": "appsecret",
                    "type": "string",
                    "maxLength": 127,
                    "readonly": 0,
                    "value": ""
                },
                {
                    "name": "AuthSn",
                    "key": "AuthSn",
                    "type": "string",
                    "maxLength": 32,
                    "readonly": 0,
                    "value": ""
                }
            ]
        },
        {
            "groupKey": "system_reboot",
            "groupName": "系统重启",
            "item": [
                {
                    "name": "自动重启系统",
                    "key": "auto_reboot",
                    "type": "boolean",
                    "readonly": 0,
                    "value": 0
                },
                {
                    "name": "时间",
                    "key": "time",
                    "type": "string",
                    "maxLength": 8,
                    "readonly": 0,
                    "value": "03:00:00"
                },
                {
                    "name": "星期",
                    "key": "week",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                    ],
                    "optionName": [
                        "每天",
                        "星期天",
                        "星期一",
                        "星期二",
                        "星期三",
                        "星期四",
                        "星期五",
                        "星期六"
                    ],
                    "readonly": 0,
                    "value": 4
                },
                {
                    "name": "日志级别",
                    "key": "log_level",
                    "type": "enum",
                    "optionValue": [
                        0,
                        1,
                        2
                    ],
                    "optionName": [
                        "最多",
                        "中等",
                        "最少"
                    ],
                    "readonly": 0,
                    "value": 0
                }
            ]
        }
    ]
}

module.exports = {
	dataFrom:dataFrom
}

	