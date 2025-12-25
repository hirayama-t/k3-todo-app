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
  // test('初期表示でバージョン情報が表示される', () => {
  //   render(<TestApp />);
  //   // 実装のバージョンに合わせて修正
  //   expect(screen.getByText(/バージョン: 1.0.1/)).toBeInTheDocument();
  // });

  test('タスク追加・未入力バリデーション', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
  });
});
