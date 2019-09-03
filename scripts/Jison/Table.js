const Table = function(element, head, headParam, bodyParam) {
    let table = {};

    let Line = function(cells, lineParam, id) {
        let line = {};

        function build() {
            lineParam = (lineParam) ? lineParam : {};

            lineParam.tag = 'tr';
            lineParam.parentNode = table.tbody;

            line.element = Creator.createElement(lineParam);
            line.cells = [];
            line.id = id;

            for (let cell of cells) {
                line.cells.push(new Cell(cell, line.element));
            }
        }

        line.remove = function() {
            line.element.remove();
        }

        line.updateCell = function(column, e) {
            line.cells[column].update(e);
        }

        line.equals = function(l) {
            return (l.id === line.id);
        }

        build();
        return line;
    }

    let Cell = function(cellParam, line) {
        let cell = {};

        function build() {
            cellParam.parentNode = line;
            cellParam.tag = 'td';
            cell.element = Creator.createElement(cellParam);
        }

        cell.update = function(e) {
            e.tag = 'td';
            Creator.update(cell.element, e);
        }

        build();
        return cell;
    }

    function build() {
        element.tag = 'table';

        table.element = Creator.createElement(element);
        table.lines = [];
        table.built = 0;

        headParam = (headParam) ? headParam : {};
        bodyParam = (bodyParam) ? bodyParam : {};

        headParam.tag = 'thead'; headParam.parentNode = table.element;
        bodyParam.tag = 'tbody'; bodyParam.parentNode = table.element;

        table.thead = Creator.createElement(headParam);
        table.tbody = Creator.createElement(bodyParam);

        table.head = head;

        initializeHead();
    }

    function initializeHead() {
        console.log('Initialize');
        for (let e of table.head) {
            e.parentNode = table.thead;
            e.tag = 'th';
            console.log(e);
            Creator.createElement(e);
        }
    }

    table.addLine = function(cells, lineParam) {
        let line = new Line(cells, lineParam, table.built);
        table.lines.push(line);
        table.built++;
        return line;
    }

    table.removeLine = function(line) {
        table.lines[line].remove();
        table.lines.splice(line, 1);
        console.log(table.lines);
    }

    table.removeLineWithObject = function(line) {
        for (let i = 0; i < table.lines.length; i++)
            if (table.lines[i].equals(line))
                table.removeLine(i);
    }

    table.updateCell = function(line, column, e) {
        table.lines[line].updateCell(column, e);
    }

    table.lineCount = function() {
        return table.lines.length;
    }

    build();
    return table;
}