module.exports = {

    "extends": ["airbnb-base"],
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module"
    },
    "rules": {
        "no-plusplus": [
            2,
            {
                "allowForLoopAfterthoughts": true
            }
        ]
    }
};
