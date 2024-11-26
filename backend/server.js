const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQL Server Database Configuration
const config = {
    user: 'genesis1', // Replace with your SQL Server username
    password: 'Gen@123', // Replace with your SQL Server password
    server: 'DESKTOP-URBGBGQ', // Replace with your server address (e.g., localhost or IP address)
    database: 'PPMS', // Replace with your database name
    options: {
        encrypt: true, // For Azure SQL or use false for local SQL Server
        trustServerCertificate: true, // Set to true for self-signed certificates
    },
};

// API Route to Get Mould IDs from Config_Mould
app.get('/api/moulds', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT MouldID, MouldName FROM Config_Mould');
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching mould names:", error);
        res.status(500).json({ error: "Database error" });
    } finally {
        //sql.close();
    }
});

// API Route to Get Preventive Maintenance Data based on mouldName
app.post('/api/maintenance/pm', async (req, res) => {
    const { mouldName, startTime, endTime } = req.body;

    try {
        await sql.connect(config);

        // Step 1: Retrieve MouldID from MouldName
        const mouldQuery = `SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName`;
        const mouldRequest = new sql.Request();
        mouldRequest.input('mouldName', sql.NVarChar, mouldName);
        const mouldResult = await mouldRequest.query(mouldQuery);

        if (mouldResult.recordset.length === 0) {
            return res.status(404).json({ error: "Mould not found" });
        }

        const mouldId = mouldResult.recordset[0].MouldID;

        // Step 2: Fetch Preventive Maintenance Data
        const pmQuery = `
            SELECT 
  
    history.CheckListID,
    history.CheckListName,
    mould.MouldName,             
    users.UserName,               
    history.PMStatus,
    history.Instance,
    history.Remark,
    history.StartTime,
    history.EndTime,
    history.PMDuration
FROM 
    [PPMS].[dbo].[Mould_Executed_PMCheckListHistory] AS history
JOIN 
    [PPMS].[dbo].[Config_Mould] AS mould 
    ON history.MouldID = mould.MouldID
JOIN 
    [PPMS].[dbo].[Config_User] AS users
    ON history.UserID = users.UserID
WHERE 
    history.MouldID = @mouldId 
    AND CAST(history.StartTime AS DATE) >= CAST(@startTime AS DATE)
    AND CAST(history.EndTime AS DATE) <= CAST(@endTime AS DATE);

        `;

        const pmRequest = new sql.Request();
        pmRequest.input('mouldId', sql.NVarChar, mouldId);
        pmRequest.input('startTime', sql.Date, new Date(startTime));
        pmRequest.input('endTime', sql.Date, new Date(endTime));

        const pmResult = await pmRequest.query(pmQuery);

        res.json(pmResult.recordset);
    } catch (error) {
        console.error("Error fetching preventive maintenance data:", error);
        res.status(500).json({ error: "Database error" });
    } finally {
        //sql.close();
    }
});


// API Route to Get Health Check Maintenance Data based on mouldName
app.post('/api/maintenance/hc', async (req, res) => {
    const { mouldName, startTime, endTime } = req.body;

    try {
        await sql.connect(config);

         // Step 1: Retrieve MouldID from MouldName
         const mouldQuery = `SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName`;
         const mouldRequest = new sql.Request();
         mouldRequest.input('mouldName', sql.NVarChar, mouldName);
         const mouldResult = await mouldRequest.query(mouldQuery);
 

        if (mouldResult.recordset.length === 0) {
            return res.status(404).json({ error: "Mould not found" });
        }

        const mouldId = mouldResult.recordset[0].MouldID;

        // Use the MouldID to fetch Health Check Maintenance data
        const query = `
SELECT 
   
    history.CheckListID,
    history.CheckListName,
    mould.MouldName,            
    users.UserName,            
    history.HCStatus,
    history.Instance,
    history.Remark,
    history.StartTime,
    history.EndTime,
    history.HCDuration
FROM 
    [PPMS].[dbo].[Mould_Executed_HCCheckListHistory] AS history
JOIN 
    [PPMS].[dbo].[Config_Mould] AS mould 
    ON history.MouldID = mould.MouldID
JOIN 
    [PPMS].[dbo].[Config_User] AS users
    ON history.UserID = users.UserID
WHERE 
    history.MouldID = @mouldId 
    AND CAST(history.StartTime AS DATE) >= CAST(@startTime AS DATE)
    AND CAST(history.EndTime AS DATE) <= CAST(@endTime AS DATE);

        `;

        const request = new sql.Request();
        request.input('mouldId', sql.NVarChar, mouldId);
        request.input('startTime', sql.Date, new Date(startTime));
        request.input('endTime', sql.Date, new Date(endTime));

        const result = await request.query(query);

        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching health check maintenance data:", error);
        res.status(500).json({ error: "Database error" });
    } finally {
      //  sql.close();
    }
});

//to fetch the instance no

// app.get('/api/instance', async (req, res) => {
//     try {
//         await sql.connect(config);
//         const result = await sql.query('SELECT DISTINCT Instance FROM Mould_Executed_PMCheckPointHistory');
//         res.json(result.recordset);
//     } catch (error) {
//         console.error("Error fetching instance names:", error);
//         res.status(500).json({ error: "Database error" });
//     } finally {
//         //sql.close();
//     }
// });

app.post('/api/instance', async (req, res) => {
    const { mouldName, startDate, endDate } = req.body; // Get data from the request body

    try {
        await sql.connect(config);
        
        // Prepare the SQL query
        const query = `
            SELECT DISTINCT Instance 
            FROM Mould_Executed_PMCheckListHistory
            WHERE MouldID = (SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName)
              AND StartTime >= @startDate 
              AND EndTime <= @endDate;
        `;
        
        // Prepare the request and bind parameters
        const request = new sql.Request();
        request.input('mouldName', sql.VarChar, mouldName);  // Declare the parameter @mouldName
        request.input('startDate', sql.Date, startDate);    // Declare the parameter @startDate
        request.input('endDate', sql.Date, endDate);        // Declare the parameter @endDate

        // Execute the query with the parameters
        const result = await request.query(query);

        res.json(result.recordset); // Return the distinct instances
    } catch (error) {
        console.error("Error fetching instance names:", error);
        res.status(500).json({ error: "Database error" });
    }
});

//------------------instance for hc

app.post('/api/instance-hc', async (req, res) => {
    const { mouldName, startDate, endDate } = req.body; // Get data from the request body

    try {
        await sql.connect(config);
        
        // Prepare the SQL query
        const query = `
            SELECT DISTINCT Instance 
            FROM Mould_Executed_HCCheckListHistory
            WHERE MouldID = (SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName)
              AND StartTime >= @startDate 
              AND EndTime <= @endDate;
        `;
        
        // Prepare the request and bind parameters
        const request = new sql.Request();
        request.input('mouldName', sql.VarChar, mouldName);  // Declare the parameter @mouldName
        request.input('startDate', sql.Date, startDate);    // Declare the parameter @startDate
        request.input('endDate', sql.Date, endDate);        // Declare the parameter @endDate

        // Execute the query with the parameters
        const result = await request.query(query);

        res.json(result.recordset); // Return the distinct instances
    } catch (error) {
        console.error("Error fetching instance names:", error);
        res.status(500).json({ error: "Database error" });
    }
});
//--------------

//to fetch the month

app.get('/api/month', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query(`
            WITH MonthTable AS (
                SELECT DISTINCT Instance, DATENAME(MONTH, CAST(Timestamp AS date)) AS Month_Name
                FROM [PPMS].[dbo].[Mould_Executed_PMCheckPointHistory]
            )
            SELECT DISTINCT Month_Name FROM MonthTable
        `);
        res.json(result.recordset);  // Send the distinct month names as JSON
    } catch (error) {
        console.error("Error fetching month names:", error);
        res.status(500).json({ error: "Database error" });
    } finally {
       // sql.close();
    }
});


//
// app.post('/api/mould-executed-pm', async (req, res) => {
//     const { mouldName, instance, month } = req.body;

//     try {
//         await sql.connect(config);

//         // Step 1: Retrieve MouldID from MouldName
//         const mouldQuery = `SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName`;
//         const mouldRequest = new sql.Request();
//         mouldRequest.input('mouldName', sql.NVarChar, mouldName);
//         const mouldResult = await mouldRequest.query(mouldQuery);

//         if (mouldResult.recordset.length === 0) {
//             return res.status(404).json({ error: "Mould not found" });
//         }

//         const mouldId = mouldResult.recordset[0].MouldID;

//         // Step 2: Derive the startDate and endDate from the provided month
//         const startDate = new Date(month);
//         const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of the month

//         // Step 3: Fetch Data from Mould_Executed_PMCheckPointHistory
//         const pmHistoryQuery = `
//             SELECT TOP (1000) [UID], [CheckListID], [CheckPointID], [CheckPointName], 
//                 [CheckArea], [CheckPointItems], [CheckPointArea], [CheckingMethod], 
//                 [JudgementCriteria], [CheckListType], [CheckPointType], [UOM], 
//                 [UpperLimit], [LowerLimit], [Standard], [CheckPointValue], 
//                 [OKNOK], [Observation], [Instance], [Timestamp]
//             FROM [PPMS].[dbo].[Mould_Executed_PMCheckPointHistory]
//             WHERE CheckListID IN (
//                 SELECT CheckListID 
//                 FROM [PPMS].[dbo].[Config_PMCheckList]
//                 WHERE MouldID = @mouldId
//             )
//               AND Instance = @instance
//               AND Timestamp >= @startDate
//               AND Timestamp <= @endDate
//         `;

//         const pmHistoryRequest = new sql.Request();
//         pmHistoryRequest.input('mouldId', sql.Int, mouldId);
//         pmHistoryRequest.input('instance', sql.NVarChar, instance);
//         pmHistoryRequest.input('startDate', sql.DateTime, startDate);
//         pmHistoryRequest.input('endDate', sql.DateTime, endDate);

//         const pmHistoryResult = await pmHistoryRequest.query(pmHistoryQuery);

//         res.json(pmHistoryResult.recordset);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: "Database error" });
//     } finally {
//         sql.close();
//     }
// });


// Helper function to get the first and last date of a month
function getMonthDateRange(month) {
    const months = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    const now = new Date();
    const monthIndex = months[month];
    const startDate = new Date(now.getFullYear(), monthIndex, 1); // 1st day of the month
    const endDate = new Date(now.getFullYear(), monthIndex + 1, 0, 23, 59, 59, 999); // Last day of the month

    return { startDate, endDate };
}

// Fetch the PM Checkpoint history data
// app.post('/api/mould-executed-pm', async (req, res) => {
//     const { mouldName, instance, month } = req.body;

//     try {
//         await sql.connect(config);

//         // Step 1: Retrieve MouldID from MouldName
//         const mouldQuery = `SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName`;
//         const mouldRequest = new sql.Request();
//         mouldRequest.input('mouldName', sql.NVarChar, mouldName);
//         const mouldResult = await mouldRequest.query(mouldQuery);

//         if (mouldResult.recordset.length === 0) {
//             return res.status(404).json({ error: "Mould not found" });
//         }

//         const mouldId = mouldResult.recordset[0].MouldID;

//         // Step 2: Derive the startDate and endDate from the provided month
//         const monthMap = {
//             january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7,
//             september: 8, october: 9, november: 10, december: 11
//         };

//         const monthLower = month.toLowerCase();
//         const startDate = new Date(new Date().getFullYear(), monthMap[monthLower], 1);
//         const endDate = new Date(new Date().getFullYear(), monthMap[monthLower] + 1, 0, 23, 59, 59, 999); // Last day of the month

//         // Step 3: Fetch Data from Mould_Executed_PMCheckPointHistory
//         const pmHistoryQuery = `
//            SELECT 
    
//     history.CheckListID,
//     checklist.CheckListName,   -- Added CheckListName from Config_PMCheckList
//     history.CheckPointID,
//     history.CheckPointName,
//     history.CheckArea,
//     history.CheckPointItems,
//     history.CheckPointArea,
//     history.CheckingMethod,
//     history.JudgementCriteria,
//     history.CheckListType,
//     history.CheckPointType,
//     history.UOM,
//     history.UpperLimit,
//     history.LowerLimit,
//     history.Standard,
//     history.CheckPointValue,
//     history.OKNOK,
//     history.Observation,
//     history.Instance,
//     history.Timestamp
// FROM 
//     [PPMS].[dbo].[Mould_Executed_PMCheckPointHistory] AS history
// JOIN 
//     [PPMS].[dbo].[Config_PMCheckList] AS checklist 
//     ON history.CheckListID = checklist.CheckListID
// WHERE 
//     checklist.MouldID = @mouldId
//     AND history.Instance = @instance
//     AND history.Timestamp >= @startDate
//     AND history.Timestamp <= @endDate;
//         `;

//         const pmHistoryRequest = new sql.Request();
//         pmHistoryRequest.input('mouldId', sql.NVarChar, mouldId); // MouldID is treated as a string
//         pmHistoryRequest.input('instance', sql.Int, instance); // Instance is an integer
//         pmHistoryRequest.input('startDate', sql.DateTime, startDate);
//         pmHistoryRequest.input('endDate', sql.DateTime, endDate);

//         const pmHistoryResult = await pmHistoryRequest.query(pmHistoryQuery);

//         res.json(pmHistoryResult.recordset);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: "Database error" });
//     } finally {
//         //sql.close();
//     }
// });

app.post('/api/mould-executed-pm', async (req, res) => {
    const { mouldName, instance } = req.body; // Removed startDate and endDate

    try {
        await sql.connect(config);

        // Step 1: Retrieve MouldID from MouldName
        const mouldQuery = `SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName`;
        const mouldRequest = new sql.Request();
        mouldRequest.input('mouldName', sql.NVarChar, mouldName);
        const mouldResult = await mouldRequest.query(mouldQuery);

        if (mouldResult.recordset.length === 0) {
            return res.status(404).json({ error: "Mould not found" });
        }

        const mouldId = mouldResult.recordset[0].MouldID;

        // Step 2: Fetch Data from Mould_Executed_PMCheckPointHistory
        const pmHistoryQuery = `
           SELECT 
                history.CheckListID,
                checklist.CheckListName,   -- Added CheckListName from Config_PMCheckList
                history.CheckPointID,
                history.CheckPointName,
                history.CheckArea,
                history.CheckPointItems,
                history.CheckPointArea,
                history.CheckingMethod,
                history.JudgementCriteria,
                history.CheckListType,
                history.CheckPointType,
                history.UOM,
                history.UpperLimit,
                history.LowerLimit,
                history.Standard,
                history.CheckPointValue,
                history.OKNOK,
                history.Observation,
                history.Instance,
                history.Timestamp
            FROM 
                [PPMS].[dbo].[Mould_Executed_PMCheckPointHistory] AS history
            JOIN 
                [PPMS].[dbo].[Config_PMCheckList] AS checklist 
                ON history.CheckListID = checklist.CheckListID
            WHERE 
                checklist.MouldID = @mouldId
                AND history.Instance = @instance;
        `;

        const pmHistoryRequest = new sql.Request();
        pmHistoryRequest.input('mouldId', sql.NVarChar, mouldId); // MouldID is treated as a string
        pmHistoryRequest.input('instance', sql.Int, instance); // Instance is an integer

        const pmHistoryResult = await pmHistoryRequest.query(pmHistoryQuery);

        res.json(pmHistoryResult.recordset);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Database error" });
    } finally {
        // Ensure connection is properly closed if needed
        // sql.close();
    }
});

//fetch the value from Mould_Executed_HCCheckPointHistory
app.post('/api/mould-executed-hc', async (req, res) => {
    const { mouldName, instance, month } = req.body;

    try {
        await sql.connect(config);

        // Step 1: Retrieve MouldID from MouldName
        const mouldQuery = `SELECT MouldID FROM Config_Mould WHERE MouldName = @mouldName`;
        const mouldRequest = new sql.Request();
        mouldRequest.input('mouldName', sql.NVarChar, mouldName);
        const mouldResult = await mouldRequest.query(mouldQuery);

        if (mouldResult.recordset.length === 0) {
            return res.status(404).json({ error: "Mould not found" });
        }

        const mouldId = mouldResult.recordset[0].MouldID;

       
        // Step 3: Fetch Data from Mould_Executed_HCCheckPointHistory
        const hcHistoryQuery = `
           SELECT 
 
    history.CheckListID,
    checklist.CheckListName,   -- Added CheckListName from Config_HCCheckList
    history.CheckPointID,
    history.CheckPointName,
    history.CheckPointCategory,
    history.StandardCondition,
    history.CheckingMethod,
    history.CheckPointType,
    history.UOM,
    history.UpperLimit,
    history.LowerLimit,
    history.Standard,
    history.CheckPointValue,
    history.OKNOK,
    history.Observation,
    history.Instance,
    history.Timestamp
FROM 
    [PPMS].[dbo].[Mould_Executed_HCCheckPointHistory] AS history
JOIN 
    [PPMS].[dbo].[Config_HCCheckList] AS checklist 
    ON history.CheckListID = checklist.CheckListID
WHERE 
    checklist.MouldID = @mouldId
    AND history.Instance = @instance
  
        `;

        const hcHistoryRequest = new sql.Request();
        hcHistoryRequest.input('mouldId', sql.NVarChar, mouldId); // MouldID is treated as a string
        hcHistoryRequest.input('instance', sql.Int, instance); // Instance is an integer
       
        const hcHistoryResult = await hcHistoryRequest.query(hcHistoryQuery);

        // Step 4: Return the result
        res.json(hcHistoryResult.recordset);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Database error" });
    }
});



//------------------to fetch the meta data

// app.get('/api/getMetadata', async (req, res) => {
//     const mouldName = req.query.mouldName;
//     console.log(`Received mouldName: ${mouldName}`);  // Add this line for debugging

//     try {
//         await sql.connect(config);
//         const result = await sql.query`
//             SELECT 
//                 m.MouldName, 
//                 md.MetaDataName, 
//                 md.MetaDataValue
//             FROM 
//                 Config_Mould m
//             JOIN 
//                 Config_PMCheckList c ON c.MouldID = m.MouldID
//             JOIN 
//                 Config_PMMetaData md ON md.CheckListID = c.CheckListID
//             WHERE 
//                 m.MouldName = ${mouldName}
//         `;
        
//         if (result.recordset.length > 0) {
//             res.json(result.recordset);
//         } else {
//             res.status(404).json({ message: 'No data found for this mould name.' });
//         }
//     } catch (err) {
//         console.error('Error executing query:', err);
//         res.status(500).json({ error: 'Database query failed' });
//     }
// });
//----------------------1-------------
// app.post('/api/getMetadata', async (req, res) => {
//     const mouldName = req.body.mouldName?.trim(); // Safe access to avoid errors
//     console.log(`Received mouldName: ${mouldName}`); // Debugging log

//     if (!mouldName) {
//         return res.status(400).json({ error: 'mouldName is required' });
//     }

//     try {
//         await sql.connect(config);
//         const result = await sql.query`
//             SELECT 
//                 m.MouldName, 
//                 md.MetaDataName, 
//                 md.MetaDataValue
//             FROM 
//                 Config_Mould m
//             JOIN 
//                 Config_PMCheckList c ON c.MouldID = m.MouldID
//             JOIN 
//                 Config_PMMetaData md ON md.CheckListID = c.CheckListID
//             WHERE 
//                 m.MouldName = ${mouldName}
//         `;
        
//         if (result.recordset.length > 0) {
//             res.json(result.recordset);
//         } else {
//             res.status(404).json({ message: 'No data found for this mould name.' });
//         }
//     } catch (err) {
//         console.error('Error executing query:', err);
//         res.status(500).json({ error: 'Database query failed' });
//     }
// });


app.post('/api/getMetadata', async (req, res) => {
    const mouldName = req.body.mouldName?.trim(); // Safe access to avoid errors
    console.log(`Received mouldName: ${mouldName}`); // Debugging log

    if (!mouldName) {
        return res.status(400).json({ error: 'mouldName is required' });
    }

    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT 
                m.MouldName, 
                md.MetaDataName, 
                md.MetaDataValue
            FROM 
                Config_Mould m
            JOIN 
                Config_PMCheckList c ON c.MouldID = m.MouldID
            JOIN 
                Config_PMMetaData md ON md.CheckListID = c.CheckListID
            WHERE 
                m.MouldName = ${mouldName}
        `;
        
        if (result.recordset.length > 0) {
            // Restructure response to key-value format
            const formattedData = result.recordset.reduce((acc, { MetaDataName, MetaDataValue }) => {
                acc[MetaDataName] = MetaDataValue;
                return acc;
            }, {});
            
            // Log the formatted data for debugging
            console.log('Formatted Response:', formattedData);

            // Send the formatted response
            res.json(formattedData);
        } else {
            res.status(404).json({ message: 'No data found for this mould name.' });
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});





// Start the server on port 5000
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });
  