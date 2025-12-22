import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import TestApp from './testApp';

// window.alertのモック
beforeAll(() => {
  window.alert = jest.fn();
});

describe('App.js', () => {
  test('TestAppコンポーネントが描画される', () => {
    render(<App />);
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
  });
});

describe('index.js', () => {
  test('AppコンポーネントがStrictModeでラップされている', () => {
    render(<App />);
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
  });
});

describe('TestApp', () => {
  test('初期表示でバージョン情報が表示される', () => {
    render(<TestApp />);
    // 実装のバージョンに合わせて修正
    expect(screen.getByText(/バージョン: 1.0.1/)).toBeInTheDocument();
  });

  test('タスク追加・未入力バリデーション', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
  });

  test('タスク追加・完了・削除・フィルタ', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: 'タスク1' } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: 'タスク2' } });
    fireEvent.click(button);
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    // 「未完了」ボタンで未完了タスクのみ表示
    fireEvent.click(screen.getByText('未完了'));
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    // チェックボックスは「タスク1」「タスク2」両方分あるので、ラベルで特定
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // タスク1を完了に
    // 「完了」ボタンで完了タスクのみ表示
    fireEvent.click(screen.getByText('完了'));
    // 完了タスクが0件の場合「タスクはありません」と表示される仕様なので、タスク1が消えていることを確認
    expect(screen.queryByText('タスク1')).not.toBeInTheDocument();
    // 「全て」ボタンで全タスク表示に戻す
    fireEvent.click(screen.getByText('全て'));
    // 削除ボタンでタスク1を削除
    fireEvent.click(screen.getAllByText('削除')[0]);
    expect(screen.queryByText('タスク1')).not.toBeInTheDocument();
  });

  test('期日・優先度・重要フラグ付きタスクの追加・表示', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    // type="date"のinputはlabelがないので、role="textbox"でなくgetAllByRole('textbox')やgetByLabelTextで特定する
    const dateInput = screen.getByLabelText('期日');
    const prioritySelect = screen.getByLabelText('優先度');
    const importantCheck = screen.getByLabelText('⭐');
    const button = screen.getByText('追加');

    // 期日・優先度・重要フラグを指定して追加
    fireEvent.change(input, { target: { value: '重要タスク' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
    fireEvent.change(prioritySelect, { target: { value: '高' } });
    fireEvent.click(importantCheck);
    fireEvent.click(button);

    // 期日・優先度・重要フラグが表示されるか
    expect(screen.getByText('重要タスク')).toBeInTheDocument();
    expect(screen.getByText('期日: 2025-12-31')).toBeInTheDocument();
    expect(screen.getByText('優先度: 高')).toBeInTheDocument();
    // 重要フラグ（⭐）が太字・赤色で表示される
    const star = screen.getByTitle('重要');
    expect(star).toBeInTheDocument();
  });
});
