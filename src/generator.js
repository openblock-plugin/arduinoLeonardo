export default Blockly => {
    Blockly.Arduino.arduino_pin_setPinMode = function (block) {
        const arg0 = block.getFieldValue('PIN') || '0';
        const arg1 = block.getFieldValue('MODE') || 'INPUT';
        const code = `pinMode(${arg0}, ${arg1});\n`;
        return code;
    };

    Blockly.Arduino.arduino_pin_setDigitalOutput = function (block) {
        const arg0 = block.getFieldValue('PIN') || '0';
        const arg1 = Blockly.Arduino.valueToCode(block, 'LEVEL', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 'LOW';
        const code = `digitalWrite(${arg0}, ${arg1});\n`;
        return code;
    };

    Blockly.Arduino.arduino_pin_menu_level = function (block) {
        const code = block.getFieldValue('level') || 'LOW';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_pin_setPwmOutput = function (block) {
        const arg0 = block.getFieldValue('PIN') || '0';
        const arg1 = Blockly.Arduino.valueToCode(block, 'OUT', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        const code = `analogWrite(${arg0}, ${arg1});\n`;
        return code;
    };

    Blockly.Arduino.arduino_pin_readDigitalPin = function (block) {
        const arg0 = block.getFieldValue('PIN') || '0';
        const code = `digitalRead(${arg0})`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_pin_readAnalogPin = function (block) {
        const arg0 = block.getFieldValue('PIN') || 'A1';
        const code = `analogRead(${arg0})`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_pin_setServoOutput = function (block) {
        const arg0 = block.getFieldValue('PIN') || 'A1';
        const arg1 = Blockly.Arduino.valueToCode(block, 'OUT', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;

        Blockly.Arduino.includes_.include_servo = '#include <Servo.h>';
        Blockly.Arduino.definitions_[`definitions_servo${arg0}`] = `Servo servo_${arg0};`;
        Blockly.Arduino.setups_[`setups_servo${arg0}`] = `servo_${arg0}.attach(${arg0}, 544, 2400);`;

        const code = `servo_${arg0}.write(${arg1});\n`;
        return code;
    };

    Blockly.Arduino.arduino_pin_attachInterrupt = function (block) {
        const arg0 = block.getFieldValue('PIN') || '2';
        const arg1 = block.getFieldValue('MODE') || 'RISING';

        let branch = Blockly.Arduino.statementToCode(block, 'SUBSTACK');
        branch = Blockly.Arduino.addLoopTrap(branch, block.id);

        Blockly.Arduino.definitions_[`definitions_ISR_${arg1}${arg0}`] =
            `void ISR_${arg1}_${arg0}() {\n${branch}}`;

        const code = `attachInterrupt(digitalPinToInterrupt(${arg0}), ISR_${arg1}_${arg0}, ${arg1});\n`;
        return code;
    };

    Blockly.Arduino.arduino_pin_detachInterrupt = function (block) {
        const arg0 = block.getFieldValue('PIN') || '2';
        const code = `detachInterrupt(digitalPinToInterrupt(${arg0}));\n`;
        return code;
    };

    Blockly.Arduino.arduino_serial_serialBegin = function (block) {
        const arg0 = block.getFieldValue('VALUE') || '9600';
        const code = `Serial.begin(${arg0});\n`;
        return code;
    };

    Blockly.Arduino.arduino_serial_serialPrint = function (block) {
        const arg0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_UNARY_POSTFIX) || '';
        const eol = block.getFieldValue('EOL') || 'warp';
        let code = '';
        if (eol === 'warp') {
            code = `Serial.println(${arg0});\n`;
        } else {
            code = `Serial.print(${arg0});\n`;
        }
        return code;
    };

    Blockly.Arduino.arduino_serial_serialAvailable = function () {
        const code = 'Serial.available()';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_serial_serialReadData = function () {
        const code = 'Serial.read()';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_data_dataMap = function (block) {
        const arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        const arg1 = Blockly.Arduino.valueToCode(block, 'ARG0', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1;
        const arg2 = Blockly.Arduino.valueToCode(block, 'ARG1', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 100;
        const arg3 = Blockly.Arduino.valueToCode(block, 'ARG2', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1;
        const arg4 = Blockly.Arduino.valueToCode(block, 'ARG3', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1000;

        const code = `map(${arg0}, ${arg1}, ${arg2}, ${arg3}, ${arg4})`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_data_dataConstrain = function (block) {
        const arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        const arg1 = Blockly.Arduino.valueToCode(block, 'ARG0', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1;
        const arg2 = Blockly.Arduino.valueToCode(block, 'ARG1', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 100;

        const code = `constrain(${arg0}, ${arg1}, ${arg2})`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_data_dataConvert = function (block) {
        const arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        const arg1 = block.getFieldValue('TYPE') || 'INTEGER';

        let code;

        switch (arg1) {
        case 'INTEGER':
            code = `String(${arg0}).toInt()`;
            break;
        case 'DECIMAL':
            code = `String(${arg0}).toFloat()`;
            break;
        case 'STRING':
            code = `String(${arg0})`;
            break;
        }

        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_data_dataConvertASCIICharacter = function (block) {
        const arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || '0';
        const code = `String(char(${arg0}))`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.arduino_data_dataConvertASCIINumber = function (block) {
        const arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || '0';
        const code = `toascii(String(${arg0})[0])`;
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    return Blockly;
};
