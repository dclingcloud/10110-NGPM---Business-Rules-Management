export interface FieldConfig {
  name: string;
  type: 'radio' | 'datasource' | 'number' | 'select' | 'checkbox_pattern';
  defaultValue?: any;
  options?: string[];
  unit?: string;
}

export interface RuleTypeConfig {
  name: string;
  fields: FieldConfig[];
  hasDetailedConfig?: boolean;
}

export const RULE_TYPES_58: string[] = [
  'HS UTF2(TCP)',
  'HS UTF2(UDP)',
  'HTTP Pattern',
  'CFlow',
  'CPACK',
  'DB2',
  'DNS',
  'DUBBO',
  'FEP',
  'FTD',
  'FTP',
  'H.323',
  'HBase',
  'HTTP',
  'IBM WebSphere MQ',
  'IMAP',
  'IMIX',
  'Informix',
  'Kafka',
  'LDAP',
  'MODBUS',
  'MSSQL',
  'Mongο',
  'MySQL',
  'NFS',
  'NTP',
  'Oracle',
  'PDXP',
  'POP3',
  'Pattern-Match application',
  'PostgreSQL',
  'Protocol Buffers',
  'RADIUS',
  'RTCP',
  'RTP',
  'RTSP',
  'Redis',
  'SGIP',
  'SIP',
  'SMB(TCP)',
  'SMB(UDP)',
  'SMTP',
  'SNMP',
  'SSH',
  'SSL',
  'STEP',
  'SYSLOG',
  'TACACS+',
  'TCP String Pattern',
  'TFTP',
  'Telnet',
  'URL Pattern',
  'UnionPay(ATM)',
  'UnionPayQCup',
  'sFlow',
  '二代支付',
  '农信银 APP',
  '特征值应用',
];

export const RULE_CONFIG_MAP: Record<string, RuleTypeConfig> = {
  'HS UTF2(TCP)': {
    name: 'HS UTF2(TCP)',
    fields: [
      { name: 'HS_UTF2解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '是否记录请求体/响应体', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
    hasDetailedConfig: true,
  },
  'HS UTF2(UDP)': {
    name: 'HS UTF2(UDP)',
    fields: [
      { name: 'HS_UTF2解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '是否记录请求体/响应体', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
    hasDetailedConfig: true,
  },
  'HTTP Pattern': {
    name: 'HTTP Pattern',
    fields: [
      { name: 'Http Pattern解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
      { name: '是否记录请求体/响应体', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
    ],
  },
  'CFlow': {
    name: 'CFlow',
    fields: [
      { name: 'CFlow解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'CPACK': {
    name: 'CPACK',
    fields: [
      { name: 'CPACK解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'DB2': {
    name: 'DB2',
    fields: [
      { name: 'DB2解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'DNS': {
    name: 'DNS',
    fields: [
      { name: 'DNS解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
  },
  'DUBBO': {
    name: 'DUBBO',
    fields: [
      { name: 'DUBBO配置', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
  },
  'FEP': {
    name: 'FEP',
    fields: [
      { name: 'FEP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'FTD': {
    name: 'FTD',
    fields: [
      { name: 'FTD解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'FTP': {
    name: 'FTP',
    fields: [
      { name: 'FTP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'H.323': {
    name: 'H.323',
    fields: [
      { name: 'H.323解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'HBase': {
    name: 'HBase',
    fields: [
      { name: 'HBase解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'HTTP': {
    name: 'HTTP',
    fields: [
      { name: 'HTTP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '只解析第一个HTTP Request/Response', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
      { name: '只统计匹配RuleMatch URL规则的HTTP Request/Response', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
      { name: 'HTTP Session信息详单速率限制(条/秒)', type: 'number', defaultValue: 100 },
    ],
  },
  'IBM WebSphere MQ': {
    name: 'IBM WebSphere MQ',
    fields: [
      { name: 'MQ二代支付解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'IMAP': {
    name: 'IMAP',
    fields: [
      { name: 'IMAP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '是否解析邮件内容', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
    ],
  },
  'IMIX': {
    name: 'IMIX',
    fields: [
      { name: 'IMIX解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'Informix': {
    name: 'Informix',
    fields: [
      { name: 'Informix解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'Kafka': {
    name: 'Kafka',
    fields: [
      { name: 'Kafka解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'LDAP': {
    name: 'LDAP',
    fields: [
      { name: 'LDAP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'MODBUS': {
    name: 'MODBUS',
    fields: [
      { name: 'MODBUS解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'MSSQL': {
    name: 'MSSQL',
    fields: [
      { name: 'MS-SQL解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Select语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Update语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Delete语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Insert语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录其他SQL语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'Mongο': {
    name: 'Mongο',
    fields: [
      { name: 'Mongο解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'MySQL': {
    name: 'MySQL',
    fields: [
      { name: 'MS-SQL解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Select语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Update语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Delete语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Insert语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Execute语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Prepare语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录其他SQL语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'NFS': {
    name: 'NFS',
    fields: [
      { name: 'NFS解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'NTP': {
    name: 'NTP',
    fields: [
      { name: 'NTP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'Oracle': {
    name: 'Oracle',
    fields: [
      { name: 'Oracle解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Select语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Update语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Delete语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录Insert语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '记录其他SQL语句', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'PDXP': {
    name: 'PDXP',
    fields: [
      { name: 'PDXP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'POP3': {
    name: 'POP3',
    fields: [
      { name: 'POP3解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '是否解析邮件内容', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
    ],
  },
  'Pattern-Match application': {
    name: 'Pattern-Match application',
    fields: [
      { name: '请选择启用的TCP Pattern', type: 'checkbox_pattern', defaultValue: false },
    ],
  },
  'PostgreSQL': {
    name: 'PostgreSQL',
    fields: [
      { name: 'PostgreSQL解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'Protocol Buffers': {
    name: 'Protocol Buffers',
    fields: [
      { name: 'Protocol Buffers解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'RADIUS': {
    name: 'RADIUS',
    fields: [
      { name: 'RADIUS解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'RTCP': {
    name: 'RTCP',
    fields: [
      { name: 'RTCP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'RTP': {
    name: 'RTP',
    fields: [
      { name: 'RTP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'RTSP': {
    name: 'RTSP',
    fields: [
      { name: 'RTSP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'Redis': {
    name: 'Redis',
    fields: [
      { name: 'Redis解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SGIP': {
    name: 'SGIP',
    fields: [
      { name: 'SGIP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SIP': {
    name: 'SIP',
    fields: [
      { name: 'SIP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SMB(TCP)': {
    name: 'SMB(TCP)',
    fields: [
      { name: 'SMB(TCP)解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SMB(UDP)': {
    name: 'SMB(UDP)',
    fields: [
      { name: 'SMB(UDP)解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SMTP': {
    name: 'SMTP',
    fields: [
      { name: 'SMTP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '是否解析邮件内容', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
    ],
  },
  'SNMP': {
    name: 'SNMP',
    fields: [
      { name: 'SNMP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SSH': {
    name: 'SSH',
    fields: [
      { name: 'SSH解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SSL': {
    name: 'SSL',
    fields: [
      { name: 'SSL解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
  },
  'STEP': {
    name: 'STEP',
    fields: [
      { name: 'STEP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'SYSLOG': {
    name: 'SYSLOG',
    fields: [
      { name: 'SYSLOG解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'TACACS+': {
    name: 'TACACS+',
    fields: [
      { name: 'TACACS+解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'TCP String Pattern': {
    name: 'TCP String Pattern',
    fields: [
      { name: 'TCP String Pattern配置', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
      { name: '是否记录请求体/响应体', type: 'radio', defaultValue: '不启用', options: ['启用', '不启用'] },
    ],
  },
  'TFTP': {
    name: 'TFTP',
    fields: [
      { name: 'TFTP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'Telnet': {
    name: 'Telnet',
    fields: [
      { name: 'Telnet解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'URL Pattern': {
    name: 'URL Pattern',
    fields: [
      { name: 'URL Pattern解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  'UnionPay(ATM)': {
    name: 'UnionPay(ATM)',
    fields: [
      { name: 'UnionPay(ATM)', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
  },
  'UnionPayQCup': {
    name: 'UnionPayQCup',
    fields: [
      { name: 'UnionPayQCup解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
  },
  'sFlow': {
    name: 'sFlow',
    fields: [
      { name: 'sFlow解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
  '二代支付': {
    name: '二代支付',
    fields: [
      { name: '二代支付解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '承载层', type: 'select', defaultValue: 'MQ', options: ['MQ'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
  },
  '农信银 APP': {
    name: '农信银 APP',
    fields: [
      { name: '农信银 APP解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
      { name: '数据源调度', type: 'datasource', defaultValue: [] },
    ],
  },
  '特征值应用': {
    name: '特征值应用',
    fields: [
      { name: '特征值应用解析', type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  },
};
