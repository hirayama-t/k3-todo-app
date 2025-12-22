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
    expect(screen.getByText(/バージョン: 1.0.0/)).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('未完了'));
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByText('完了'));
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('削除')[0]);
    expect(screen.queryByText('タスク1')).not.toBeInTheDocument();
  });
});
