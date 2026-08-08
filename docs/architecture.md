# TradeFlow Architecture

TradeFlow is a role-based internal web application designed for a wholesale/distribution company. The application is divided into four main modules: Auth/Roles, Customer CRM, Product/Inventory, and Sales Challans.

The role model enforces distinct permissions for Admin, Sales, Warehouse, and Accounts users, controlling access to specific endpoints.

The core of the system is the Draft/Confirm/Cancel state machine for Sales Challans. The challan confirmation process operates as a strict atomic database transaction. Stock changes are exclusively executed during this confirmation step. Product data is snapshotted onto challan items upon creation to preserve historical accuracy independently of subsequent product catalog changes.
