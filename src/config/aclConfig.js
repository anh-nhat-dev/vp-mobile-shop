module.exports = [
  {
    roles: ["*"],
    allows: [{ resources: ["/ping"], permissions: ["*"] }],
  },
  {
    roles: ["super-admin"],
    allows: [
      { resources: ["/users/list"], permissions: ["GET"] },
      { resources: ["/api/acl"], permissions: ["*"] },
    ],
  },
  {
    roles: ["admin"],
    allows: [{ resources: ["/users/list"], permissions: ["GET"] }],
  },
  {
    roles: ["manager"],
    allows: [{ resources: ["/seller"], permissions: ["*"] }],
  },
  {
    roles: ["user"],
    allows: [],
  },
];
