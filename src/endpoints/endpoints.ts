
const Exports = [
'EventAPI',
'ContactAPI',
'LoginAPI',
'MediaAPI',
'ServiceAPI',
'SettingsAPI',
'UserAPI',
'VendorAPI',
]
 
const Endpoints = [ 
{ path: '/event', methods: [{name: 'get', http: 'GET'},{name: 'put', http: 'PUT'},{name: 'delete', http: 'DELETE'},{name: 'patch', http: 'PATCH'}], resource: 'event'},{ path: '/contact', methods: [{name: 'get', http: 'GET'},{name: 'put', http: 'PUT'},{name: 'delete', http: 'DELETE'},{name: 'patch', http: 'PATCH'}], resource: 'contact'},{ path: '/login', methods: [{name: 'post', http: 'POST'}], resource: 'login'},{ path: '/media', methods: [{name: 'get', http: 'GET'},{name: 'post', http: 'POST'},{name: 'put', http: 'PUT'},{name: 'delete', http: 'DELETE'},{name: 'patch', http: 'PATCH'}], resource: 'media'},{ path: '/service', methods: [{name: 'get', http: 'GET'},{name: 'post', http: 'POST'}], resource: 'service'},{ path: '/settings', methods: [{name: 'post', http: 'POST'}], resource: 'settings'},{ path: '/settings/id', methods: [{name: 'getByID', http: 'GET'}], resource: 'settings'},{ path: '/user', methods: [{name: 'get', http: 'GET'},{name: 'put', http: 'PUT'}], resource: 'user'},{ path: '/vendor', methods: [{name: 'get', http: 'GET'}], resource: 'vendor'},];
export {Endpoints, Exports}
