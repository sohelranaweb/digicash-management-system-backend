"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.AgentApprovalStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var AgentApprovalStatus;
(function (AgentApprovalStatus) {
    AgentApprovalStatus["PENDING"] = "PENDING";
    AgentApprovalStatus["APPROVED"] = "APPROVED";
    AgentApprovalStatus["SUSPENDED"] = "SUSPENDED";
})(AgentApprovalStatus || (exports.AgentApprovalStatus = AgentApprovalStatus = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
