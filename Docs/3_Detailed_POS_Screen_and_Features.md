# **AKRDev RMS \- Detailed POS Screen & Features**

## **1\. Global UI Layout & Shell**

The POS interface is designed as a Single Page Application (SPA) shell optimized for speed, touchscreens, and high-contrast visibility.

* **Collapsible Sidebar (Left):**  
  * **Toggle Behavior:** Top hamburger menu (≡) toggles between Expanded (250px width, Icon \+ Text) and Collapsed (60px width, Icon only).  
  * **Navigation Links (in order):** Tables, Orders, Items, Employees, Activity Log, Settings.  
  * **Active State:** The currently viewed module is highlighted with a primary color background.  
  * **Bottom Section:** Current User (Avatar, Name, Role), Lock Terminal, and Logout buttons.  
* **Main Content Area (Center/Top):** Displays the active module.  
* **Global Footer / Status Bar (Bottom Edge \- Small Size):**  
  * **Clock & Date:** Real-time digital clock (e.g., 14:30 | 24-Oct-2026).  
  * **Network & Sync Status:**  
    * 🟢 Online & Synced  
    * 🟡 Offline (Local Mode)  
    * 🔴 Cloud Disconnected  
  * **Notification Bell:** Shows alerts.  
* **Global Overlays:**  
  * **Toasts/Snackbars:** Auto-dismissing popups at the bottom-center for messages.

## **2\. Module 1: Tables (The Main Operations Hub)**

* **Header Actions:**  
  * **Area Filter (Multi-Select):** Select single, multiple, or 'All' Areas.  
  * **Quick Stats:** Total Tables: 20, Occupied: 5, Available: 15\.  
  * **"Edit Layout" Toggle:** To drag-and-drop tables or \+ Add Table.  
* **Table Grid Layout:**  
  * If multiple areas or 'All' are selected, the view stacks vertically: **Area Name Title** \-\> **Grid of Tables** \-\> **Next Area Name Title** \-\> **Grid**.  
* **Table Card Anatomy (What each tile shows):**  
  * **Table Name/Number:** Large, bold text (e.g., "T-04").  
  * **Capacity:** Small icon (e.g., 👤 x 4).  
  * **Amount:** If orders exist, shows the running subtotal (e.g., ₹ 1,250).  
  * **Quick Action Buttons (Visible on hover/click):**  
    * If Bill NOT printed: Bill  
    * If Bill IS printed: Settle  
* **Status Indicators (Background Colors):**  
  * Green (Available): Empty table.  
  * Yellow (KOT Pending): Order punched but not fired.  
  * Orange (Occupied): Guests seated, food is being prepared/served.  
  * Blue (Billed): Bill printed, waiting for settlement.  
* **Sync Status (Top Right Corner of Table Card):**  
  * ✓ Synced, ⟳ Syncing, ⚠ Pending Sync.

## **3\. Module 2: The Ordering Cart & Menu (Active Table View)**

When a table is clicked, the screen splits into three horizontal panels: Table Switcher (10%), Menu (60%), and Cart (30%).

* **Panel 1: Quick Table Switcher (Left \- 10% Width):**  
  * Area title or switch dropdown at the top, with a scrollable list of tables to quickly jump between active orders.  
* **Panel 2: Menu Area (Center \- 60% Width):**  
  * **Search Bar:** Fast text search by name or shortcode.  
  * **Category Ribbon:** Horizontal scrollable buttons.  
  * **Item Grid:** Clickable, text-only tiles showing Item Name and Price (No images).  
* **Panel 3: Cart Panel (Right \- 30% Width):**  
  * **Cart Header:**  
    * Table Number.  
    * Guest Count input.  
    * **Customer Details Icon:** Clicking opens a dropdown/popup to enter Customer Name and Phone Number (Must include Country Code). *Note: Phone number acts as the unique ID linking the user to the order. The phone input must auto-search the database as the cashier types; if the customer already exists, it displays a dropdown to quickly autofill their details.*  
  * **Item List (Grouped by KOT):**  
    * **KOT Group Header:** Shows KOT \#, Time, and Punched By (Name).  
    * **Item Row Anatomy:** Item Name, Variation, \+ / \- buttons, Unit Price, Line Total Price.  
    * **Item Notes:** Small input/icon on each item for individual notes (e.g., "Less spicy").  
    * **Cancellation Display:** If an item is cancelled after KOT is fired, it is *not* removed from the list. It gets a strikethrough, price changes to 0, and a tag shows Deleted by: \[Name\].  
  * **Overall Order Note:** A text area at the bottom of the list for whole-order instructions.  
  * **Cart Math Summary:** Subtotal, Taxes, Grand Total.  
  * **Action Buttons (Bottom Edge):**  
    * KOT (Yellow): Fires pending items to kitchen.  
    * Bill (Blue): Prints the check. Changes table to Billed.  
    * Settle (Green): Only appears/enabled *after* the bill is printed. Opens the Settlement Module.  
* **Table Locking & Restrictions:**  
  * Only one active editor can modify a table at a time.  
  * **Billed Order Restriction:** Once the Bill button is pressed, the cart is locked. Only a Cashier (via PIN entry) can unlock it to add/remove items.

## **4\. Module 3: Items (Menu Management)**

* **Layout:** Master-Detail view. List on the left, edit form on the right.  
* **Category Setup Form:** Category Name, Default Tax %, Default KOT Printer.  
* **Item Setup Form:**  
  * **Basic Info:** Item Name, Shortcode, Base Price, Category Assignment.  
  * **Printer & Tax Overrides:** Toggles to override the parent category's Tax or Printer settings.  
  * **Variations Engine:** A dynamic sub-table for sizes/types (e.g., "Half" \= 150, "Full" \= 300).  
  * **Availability:** "In Stock" toggle.

## **5\. Module 4: Orders (The Ledger)**

* **Tabs:** Running Orders and Settled Orders.  
* **Data Table Columns:** Order ID, Date/Time, Table, Payment Mode, Total Amount, Sync Status. *(No Captain name displayed here).*  
* **Actions:** Reprint Bill, Void Order (Before Settlement \- Requires Admin PIN), Refund Order (After Settlement \- Requires Admin PIN), Force Sync.

## **6\. Module 5: Employees & Security (Access Control)**

* **Data Table:** List of staff showing Name, Role, and Status.  
* **Authentication Rules:**  
  * **Captain App:** Requires account password for first-time login. After that, requires a simple PIN entry once per day.  
  * **Cashier/POS Terminal:** Requires PIN entry to open the POS, process a settlement, or modify a billed order.  
* **Roles (Admin, Cashier, Captain):** Strict toggles for what each role can access. Admin cannot edit or delete activity logs.

## **7\. Module 6: Settings (Whitelabel & Setup)**

* **Business Profile:** Company Name, Address, Phone, Email, FSSAI Number, GST Number.  
* **Tax Configuration:** Define Tax Slabs. Choose "Tax Inclusive" or "Tax Exclusive".  
* **Branding & Print Design:** Logo upload, Custom Header/Footer Text, toggles for GST/FSSAI print visibility.  
* **Printer Management:** Map logical names to Windows Printers. Shows Queue Status (Ready, Printing, Error) and allows Retry Print.

## **8\. Module 7: Activity Log (Immutable Audit Trail)**

* **Layout:** Chronological data table feed.  
* **Details Captured:** Timestamp, User Name, Module Name, Action taken, Old Value, New Value.  
* **Security Rule:** Strictly Immutable.

## **9\. Module 8: Settlement (The Payment Hub)**

This is a strictly focused modal popup that *only* appears when the Settle button is clicked on an active table (either from the Floor plan or the Cart).

* **Targeted Focus:** It handles *only* the specific order that was clicked.  
* **The Math Column:** Subtotal, Taxes, Discount Engine (Percentage/Flat), Grand Total Due.  
* **Payment Entry:**  
  * Input fields to enter exactly how much is being paid via:  
    * Cash Amount  
    * Card Amount  
    * UPI Amount  
  * **Change Calculator:** Dynamically shows "Change to Return" if the entered cash exceeds the total due.  
* **Audit Data Captured:** Settled By, Time, Payment Split, Discount Applied & Reason.  
* **Final Action:** Complete Settlement finalizes the order, syncs to DB, and clears the table back to available.