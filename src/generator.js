export default Blockly => {
    Blockly.Arduino['arduino_pin_setPinMode'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || '0';
        var arg1 = block.getFieldValue('MODE') || 'INPUT';
        var code = 'pinMode(' + arg0 + ', ' + arg1 + ');\n';
        return code;
    };

    Blockly.Arduino['arduino_pin_setDigitalOutput'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || '0';
        var arg1 = Blockly.Arduino.valueToCode(block, 'LEVEL', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 'LOW';
        var code = 'digitalWrite(' + arg0 + ', ' + arg1 + ');\n';
        return code;
    };

    Blockly.Arduino['arduino_pin_menu_level'] = function (block) {
        var code = block.getFieldValue('level') || 'LOW';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_pin_setPwmOutput'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || '0';
        var arg1 = Blockly.Arduino.valueToCode(block, 'OUT', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        var code = 'analogWrite(' + arg0 + ', ' + arg1 + ');\n';
        return code;
    };

    Blockly.Arduino['arduino_pin_readDigitalPin'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || '0';
        var code = 'digitalRead(' + arg0 + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_pin_readAnalogPin'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || 'A1';
        var code = 'analogRead(' + arg0 + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_pin_setServoOutput'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || 'A1';
        var arg1 = Blockly.Arduino.valueToCode(block, 'OUT', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;

        Blockly.Arduino.includes_['include_servo'] = '#include <Servo.h>';
        Blockly.Arduino.definitions_['definitions_servo' + arg0] = 'Servo servo_' + arg0 + ';';
        Blockly.Arduino.setups_['setups_servo' + arg0] = 'servo_' + arg0 + '.attach(' + arg0 + ', 544, 2400);';

        var code = 'servo_' + arg0 + '.write(' + arg1 + ');\n';
        return code;
    };

    Blockly.Arduino['arduino_pin_attachInterrupt'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || '2';
        var arg1 = block.getFieldValue('MODE') || 'RISING';

        var branch = Blockly.Arduino.statementToCode(block, 'SUBSTACK');
        branch = Blockly.Arduino.addLoopTrap(branch, block.id);

        Blockly.Arduino.definitions_['definitions_ISR_' + arg1 + arg0] =
            'void ISR_' + arg1 + '_' + arg0 + '() {\n' + branch + '}';

        var code = 'attachInterrupt(digitalPinToInterrupt(' + arg0 + '), ISR_' + arg1 + '_' + arg0 + ', ' + arg1 + ');\n';
        return code;
    };

    Blockly.Arduino['arduino_pin_detachInterrupt'] = function (block) {
        var arg0 = block.getFieldValue('PIN') || '2';
        var code = 'detachInterrupt(digitalPinToInterrupt(' + arg0 + '));\n';
        return code;
    };

    Blockly.Arduino['arduino_serial_serialBegin'] = function (block) {
        var arg0 = block.getFieldValue('VALUE') || '9600';
        var code = 'Serial.begin(' + arg0 + ');\n';
        return code;
    };

    Blockly.Arduino['arduino_serial_serialPrint'] = function (block) {
        var arg0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_UNARY_POSTFIX) || '';
        var eol = block.getFieldValue('EOL') || 'warp';
        var code = '';
        if (eol === 'warp') {
            code = 'Serial.println(' + arg0 + ');\n';
        } else {
            code = 'Serial.print(' + arg0 + ');\n';
        }
        return code;
    };

    Blockly.Arduino['arduino_serial_serialAvailable'] = function () {
        var code = 'Serial.available()';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_serial_serialReadData'] = function () {
        var code = 'Serial.read()';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_data_dataMap'] = function (block) {
        var arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        var arg1 = Blockly.Arduino.valueToCode(block, 'ARG0', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1;
        var arg2 = Blockly.Arduino.valueToCode(block, 'ARG1', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 100;
        var arg3 = Blockly.Arduino.valueToCode(block, 'ARG2', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1;
        var arg4 = Blockly.Arduino.valueToCode(block, 'ARG3', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1000;

        var code = 'map(' + arg0 + ', ' + arg1 + ', ' + arg2 + ', ' + arg3 + ', ' + arg4 + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_data_dataConstrain'] = function (block) {
        var arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        var arg1 = Blockly.Arduino.valueToCode(block, 'ARG0', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 1;
        var arg2 = Blockly.Arduino.valueToCode(block, 'ARG1', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 100;

        var code = 'constrain(' + arg0 + ', ' + arg1 + ', ' + arg2 + ')';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_data_dataConvert'] = function (block) {
        var arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || 0;
        var arg1 = block.getFieldValue('TYPE') || 'INTEGER';

        var code;

        switch (arg1) {
        case 'INTEGER':
            code = 'String(' + arg0 + ').toInt()';
            break;
        case 'DECIMAL':
            code = 'String(' + arg0 + ').toFloat()';
            break;
        case 'STRING':
            code = 'String(' + arg0 + ')';
            break;
        }

        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_data_dataConvertASCIICharacter'] = function (block) {
        var arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || '0';
        var code = 'String(char(' + arg0 + '))';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino['arduino_data_dataConvertASCIINumber'] = function (block) {
        var arg0 = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_UNARY_POSTFIX) || '0';
        var code = 'toascii(String(' + arg0 + ')[0])';
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };

    return Blockly;
};
