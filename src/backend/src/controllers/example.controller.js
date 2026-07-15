exports.getExampleData = (req, res) => {
    const data = { message: "Daten erfolgreich geladen", items: [1, 2, 3] };
    
    res.status(200).json({
        success: true,
        data: data
    });
};

exports.createExample = (req, res) => {
    const payload = req.body;
    
    res.status(201).json({
        success: true,
        message: "Eintrag erfolgreich erstellt",
        receivedData: payload
    });
};