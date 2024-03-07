db.createCollection("msg_841_555", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Msg collection schema validation",
            required: ["sender", "receiver", "msg", "read"],
            properties: {
                sender: {
                    bsonType: ['int'],
                    description: "Sender phone number must be an interger"
                },
                receiver: {
                    bsonType: ["int"],
                    description: "Sender phone number must be an interger"
                },
                read: {
                    bsonType: ["bool"],
                    description: "Sender phone number must be an interger"
                }
            }
        }
    }
})